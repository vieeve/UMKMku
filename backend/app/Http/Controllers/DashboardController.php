<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user()->id;
        $today = Carbon::today();
        
        $todaySales = Transaction::where('user_id', $userId)->whereDate('created_at', $today)->sum('total_amount');
        $todayProfit = Transaction::where('user_id', $userId)->whereDate('created_at', $today)->sum('total_profit');

        $totalProducts = Product::where('user_id', $userId)->count();
        $lowStockProducts = Product::where('user_id', $userId)->whereColumn('stock', '<=', 'min_stock')->get();

        return response()->json([
            'metrics' => [
                'today_sales' => (float) $todaySales,
                'today_profit' => (float) $todayProfit,
            ],
            'products' => [
                'total_count' => $totalProducts,
                'low_stock_count' => $lowStockProducts->count(),
                'low_stock_items' => $lowStockProducts
            ]
        ]);
    }
}
