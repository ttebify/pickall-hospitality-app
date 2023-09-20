<x-guest-layout>
    <div class="relative z-10 pt-48 pb-52 bg-cover bg-center" style="background-image: url(/img/6.jpg)">
        <div class="absolute h-full w-full bg-black opacity-70 top-0 left-0 z-10"></div>
        <div class="container relative z-20 text-white text-center text-2xl">
            <h2 class="font-bold text-5xl mb-8 langBN">{{ __('Discover your perfect getaway') }}</h2>
            <p class="text-2xl mt-8 langBN">
                {{ __('Experience the Ultimate in Hospitality: From luxurious apartments in prime locations to convenient car Rentals for your every need') }}
            </p>
        </div>
    </div>

    <!-- Search From Area -->
    <div class="-mt-10">
        <div class="container">
            <div class="rounded-lg bg-white p-4 relative z-20 shadow-lg home-search">
                @include('components.property-search-form', ['locations' => $locations])
            </div>
        </div>
    </div>

    <div class="py-20 text-center">
        <div class="container">
            <h2 class="section-heading">Elevate Your Stay with Tailored Experiences<span class="underline"> That Suit
                    Your Every Desire!</span></h2>
            <p class="text-gray-500 text-2xl font-bold mb-10">Unlock a World of Possibilities with Our Exceptional
                Services!</p>

            <a class="border-2 border-gray-700 rounded-2xl text-xl px-8 py-3 inline-block" href="">Start
                Exploring Now</a>
        </div>
    </div>

    <div class="container text-center pt-14">
        <h2 class="section-heading">{{ __('Discover More About Us') }}</h2>
        <div class="relative mt-10 mb-14 bg-cover rounded-xl py-24 bg-center" style="background-image: url(/img/6.jpg)">
            <div class="absolute w-full h-full rounded-xl opacity-50 bg-black left-0 top-0"></div>
            <div class="relative z-20">
                <a href="" class="text-white text-xl flex flex-col justify-center items-center"><span
                        class="border-2 border-white w-12 h-12 text-center pt-1 pl-1 leading-10 text-2xl hover:border-yellow-500 duration-200 rounded-full mb-2"><i
                            class="fa fa-play"></i></span>{{ __('Watch Our Video') }}</a>
            </div>
        </div>

        <div class="text-xl">
            <p>Discover the epitome of luxury and comfort through our curated selection of apartments and car rental
                services. We are dedicated to providing you with unforgettable experiences, whether it's a city escape
                or a leisurely road trip.</p>
        </div>
    </div>

    <div class="container pt-14">
        <div class="flex justify-center items-center">
            <a href="" class="btn">Start Your Journey with Filters</a>
            <p class="mx-10">or</p>
            <a href="" class="btn-outline">Explore the Map for Destinations</a>
        </div>
    </div>

    <!-- Last Added Objects -->
    <div class="container py-14">
        <h2 class="section-heading">{{ __('Check Out Our Latest Properties') }}</h2>
        <div class="flex flex-wrap -mx-2 mt-10">

            @foreach ($latest_properties as $property)
                @include('components.single-property-card', ['property' => $property, 'width' => 'w-1/4'])
            @endforeach

        </div>
    </div>

</x-guest-layout>
