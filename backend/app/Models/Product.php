<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'user_id', 'category_id', 'name', 'sku', 'unit', 'price', 'cost_price', 'stock', 'min_stock'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    protected static function booted()
    {
        static::saved(function ($product) {
            self::cleanupEmptyCategories();
        });

        static::deleted(function ($product) {
            self::cleanupEmptyCategories();
        });
    }

    protected static function cleanupEmptyCategories()
    {
        \App\Models\Category::doesntHave('products')->delete();
    }
}
