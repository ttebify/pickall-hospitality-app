<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Http;

class Property extends Model
{
    use HasFactory;

    protected $fillable = [
        'name','name_tr','featured_image','location_id','price','sale','type','bedrooms','drawing_rooms','bathrooms','net_sqm','gross_sqm','pool','overview','overview_tr','why_buy','why_buy_tr','description','description_tr',
    ];
    // protected $guarded = ['created_at', 'updated_at'];
    // protected $hidden = ['created_at', 'updated_at'];


    //    public function featured() {
    //        $this->belongsTo(Media::class, 'featured_media_id');
    //    }

    public function location() {
        return $this->belongsTo(Location::class, 'location_id');
    }

    public function gallery() {
        return $this->hasMany(Media::class, 'property_id');
    }

    public function dynamic_pricing($lira) {
        $current_currency = Cookie::get('currency', 'usd');
        if($current_currency == 'usd') {
            $get = Http::get('https://freecurrencyapi.net/api/v2/latest?apikey=cur_live_LAV8H8dhcXvYyjoRCPVb3tf5MhQ5oXTi8Veu9f9C&base_currency=USD');
            if($get->successful()) {
                $usd = intval($lira * $get->json()['data']['USD']);
                $usd = number_format($usd, 2);
                return $usd . ' USD';
            }
        }
        elseif($current_currency == 'ngn'){
            $get = Http::get('https://freecurrencyapi.net/api/v2/latest?apikey=cur_live_LAV8H8dhcXvYyjoRCPVb3tf5MhQ5oXTi8Veu9f9C&base_currency=USD');
            if($get->successful()) {
                $bdt = intval($lira * $get->json()['data']['NGN']);
                $bdt = number_format($bdt, 2);
                return $bdt . ' NGN';
            }
        } else {
            $lira = number_format($lira, 2);
            return $lira . ' USD';
        }
    }

}
