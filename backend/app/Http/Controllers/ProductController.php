<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $products = Product::where('user_id', $request->user()->id)
            ->with('category')
            ->get()
            ->map(function($product) {
                return array_merge($product->toArray(), [
                    'category' => $product->category ? ['id' => $product->category->id, 'name' => $product->category->name] : null,
                ]);
            });

        return response()->json($products);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'category' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'sku' => 'nullable|string|unique:products,sku,NULL,id,user_id,' . $request->user()->id,
            'unit' => 'required|string',
            'price' => 'required|numeric|min:0',
            'cost_price' => 'required|numeric|min:0',
            'stock' => 'required|numeric|min:0',
            'min_stock' => 'required|numeric|min:0',
            'status' => 'nullable|in:Aktif,Nonaktif',
        ]);

        $data = $request->all();
        $data['user_id'] = $request->user()->id;
        $data['status'] = $request->input('status', 'Aktif');

        if ($request->filled('category') && empty($data['category_id'])) {
            $category = \App\Models\Category::firstOrCreate([
                'name' => $request->category,
                'user_id' => $request->user()->id
            ]);
            $data['category_id'] = $category->id;
        }

        try {
            $product = Product::create($data);
            return response()->json($product->load('category'), 201);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Failed to create product: " . $e->getMessage());
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, Product $product)
    {
        if ($product->user_id !== $request->user()->id) {
            abort(403);
        }

        $request->validate([
            'name' => 'sometimes|required|string',
            'category' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'sku' => 'nullable|string|unique:products,sku,' . $product->id . ',id,user_id,' . $request->user()->id,
            'unit' => 'sometimes|required|string',
            'price' => 'sometimes|required|numeric|min:0',
            'cost_price' => 'sometimes|required|numeric|min:0',
            'stock' => 'sometimes|required|numeric|min:0',
            'min_stock' => 'sometimes|required|numeric|min:0',
            'status' => 'sometimes|required|in:Aktif,Nonaktif',
        ]);

        $data = $request->all();

        if ($request->filled('category') && empty($data['category_id'])) {
            $category = \App\Models\Category::firstOrCreate([
                'name' => $request->category,
                'user_id' => $request->user()->id
            ]);
            $data['category_id'] = $category->id;
        }

        $product->update($data);

        return response()->json($product->load('category'));
    }

    public function destroy(Request $request, Product $product)
    {
        if ($product->user_id !== $request->user()->id) {
            abort(403);
        }
        $product->delete();
        return response()->json(null, 204);
    }
}
