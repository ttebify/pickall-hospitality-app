
<div class="fixed top-0 w-full py-4 px-12 flex justify-between items-center z-30 sticky-header {{request()->routeIs('home') ? '' : 'general-header'}}">
    <div class="min-w-max">
        <a href="{{route('home')}}"><img width="100" src="/img/house-logo.png" alt=""></a>
    </div>

    <div class="w-full">
        <ul class="flex justify-center">
            <li><a class="inline-block p-4 text-white {{ request()->is('*page/about-us*') ? 'bg-gray-50' : '' }}" href="{{ route('page', 'about-us') }}">{{ __('About Us') }}</a></li>
            <li><a class="inline-block p-4 text-white {{ request()->is('page/contact-us') ? 'bg-gray-50' : '' }}" href="{{ route('page', 'contact-us') }}">{{ __('Contact Us') }}</a></li>
            
            @guest
                <li><a class="inline-block p-4 text-white {{ request()->is('login') ? 'bg-gray-50' : '' }}" href="{{ route('login') }}">{{ __('Login') }}</a></li>
                <li><a class="inline-block p-4 text-white {{ request()->is('register') ? 'bg-gray-50' : '' }}" href="{{ route('register') }}">{{ __('Register') }}</a></li>
            @endguest
    
            @auth
                <li>
                    <form action="{{ route('logout') }}" method="POST">
                        @csrf
                        <button type="submit" class="inline-block p-4 text-white">{{ __('Logout') }}</button>
                    </form>
                </li>
            @endauth
        </ul>
    </div>
    
    

    <div class="min-w-max text-3xl flex justify-end">
        <!------ Currency Change Button ------->
        <div class="mr-10 text-2xl currency">
            <a class="inline-block text-xl rounded-full px-3 py-1 text-white" href="{{ route('currency', 'usd') }}" title="Change Currency to Doller">$ - Dollar</a>
            <a class="inline-block text-xl rounded-full px-3 py-1 text-white" href="{{ route('currency', 'ngn') }}" title="Change Currency to Naira">₦‎ - Naira</a>
        </div>

        <!------ Language Change Button - Flag ------->
        <a href="{{ LaravelLocalization::getLocalizedURL('en') }}" title="English Language">🇬🇧</a>
        <a href="{{ LaravelLocalization::getLocalizedURL('ha') }}" title="Hausa Language" class="px-3">
            🇳🇬
        </a>
    </div>

</div>
