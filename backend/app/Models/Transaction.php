<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = [
        'user_id',
        'total_amount',
        'total_profit',
        'payment_method',
        'status',
    ];

    public function items()
    {
        return $this->hasMany(TransactionItem::class);
    }
}
