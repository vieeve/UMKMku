<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(Category::where('user_id', $request->user()->id)->withCount('products')->get());
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|string|unique:categories,name,NULL,id,user_id,' . $request->user()->id]);
        
        $data = $request->all();
        $data['user_id'] = $request->user()->id;

        $category = Category::create($data);
        return response()->json($category, 201);
    }

    public function update(Request $request, Category $category)
    {
        $request->validate([
            'name' => 'required|string|unique:categories,name,' . $category->id
        ]);

        $category->update($request->all());

        return response()->json($category);
    }

    public function destroy(Category $category)
    {
        $category->delete();
        return response()->json(null, 204);
    }
}
