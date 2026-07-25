<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $transactions = Transaction::where('user_id', $request->user()->id)
            ->with('items.product')
            ->orderBy('id', 'asc')
            ->get();

        $mapped = $transactions->map(function ($trx, $index) {
            $seq = $index + 1;
            $trx->invoice_no = 'TRX-' . str_pad($seq, 5, '0', STR_PAD_LEFT);
            return $trx;
        });

        return response()->json($mapped->sortByDesc('id')->values());
    }

    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'payment_method' => 'required|string',
        ]);

        try {
            DB::beginTransaction();

            $totalAmount = 0;
            $totalProfit = 0;
            $transactionItems = [];

            foreach ($request->items as $item) {
                $product = Product::lockForUpdate()->find($item['product_id']);
                
                // Security check: ensure product belongs to user
                if ($product->user_id !== $request->user()->id) {
                    throw new \Exception('Produk tidak valid.');
                }

                if ($product->stock < $item['quantity']) {
                    throw new \Exception("Stok tidak mencukupi untuk {$product->name}");
                }

                $subtotal = $item['quantity'] * $product->price;
                $profit = $item['quantity'] * ($product->price - $product->cost_price);

                $totalAmount += $subtotal;
                $totalProfit += $profit;

                $product->decrement('stock', $item['quantity']);

                $transactionItems[] = [
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                    'subtotal' => $subtotal,
                    'cost_price' => $product->cost_price,
                ];
            }

            $transaction = Transaction::create([
                'user_id' => $request->user()->id,
                'total_amount' => $totalAmount,
                'total_profit' => $totalProfit,
                'payment_method' => $request->payment_method,
                'status' => 'Selesai'
            ]);

            $transaction->items()->createMany($transactionItems);

            DB::commit();

            // Calculate the user's transaction index
            $seq = Transaction::where('user_id', $request->user()->id)->count();
            $transaction->invoice_no = 'TRX-' . str_pad($seq, 5, '0', STR_PAD_LEFT);

            return response()->json($transaction->load('items.product'), 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }
}
