import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import { Link } from 'react-router-dom';

// Swiper React imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination, Parallax } from 'swiper/modules';

// Swiper core styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const BannerSlider = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await api.get('GetBanner');
                if (response.data && response.data.data) {
                    setBanners(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch banners", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBanners();
    }, []);

    if (loading) {
        return (
            <div className="w-full aspect-[16/7] bg-slate-100 animate-pulse rounded-2xl" />
        );
    }

    if (banners.length === 0) return null;

    return (
        <div className="relative w-full max-h-[80vh] overflow-hidden">
            <Swiper
                modules={[Autoplay, EffectFade, Navigation, Pagination, Parallax]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                speed={1000}
                parallax={true}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
                loop={banners.length > 1}
                navigation={{
                    prevEl: '.swiper-btn-prev',
                    nextEl: '.swiper-btn-next',
                }}
                pagination={{
                    el: '.swiper-custom-pagination',
                    clickable: true,
                    renderBullet: (index, className) =>
                        `<span class="${className} !w-8 !h-1.5 !rounded-full !bg-white/50 data-[swiper-element-active]:!bg-white data-[swiper-element-active]:!w-12 transition-all duration-300"></span>`,
                }}
                className="w-full"
            >
                {banners.map((banner, index) => (
                    <SwiperSlide key={index}>
                        <Link
                            to={banner.ActionUrl || '/'}
                            className="relative block w-full overflow-hidden"
                            style={{ aspectRatio: '16/7' }}
                        >
                            {/* Parallax background image */}
                            <div
                                data-swiper-parallax="-20%"
                                className="absolute inset-0 w-[120%] -left-[10%] h-full"
                            >
                                <img
                                    src={banner.BannerUrl}
                                    alt={banner.HeadingText || `Banner ${index + 1}`}
                                    className="w-full h-full object-cover object-center"
                                />
                            </div>

                            {/* Dark gradient overlay 
                            <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />*/}

                            {/* Text content with parallax 
                            {(banner.HeadingText || banner.SubHeadingText) && (
                                <div className="absolute inset-0 flex flex-col justify-center px-10 md:px-20 max-w-2xl">
                                    {banner.HeadingText && (
                                        <h2
                                            data-swiper-parallax="-300"
                                            className="text-white font-display text-3xl md:text-5xl font-bold leading-tight mb-3 drop-shadow-lg"
                                        >
                                            {banner.HeadingText}
                                        </h2>
                                    )}
                                    {banner.SubHeadingText && (
                                        <p
                                            data-swiper-parallax="-200"
                                            className="text-white/85 text-sm md:text-lg mb-6 leading-relaxed"
                                        >
                                            {banner.SubHeadingText}
                                        </p>
                                    )}
                                    <div data-swiper-parallax="-100">
                                        <span className="inline-block bg-primary hover:bg-orange-600 text-white font-bold text-sm uppercase tracking-widest px-8 py-3 rounded-full transition-colors shadow-xl">
                                            Shop Now
                                        </span>
                                    </div>
                                </div>
                            )}*/}
                        </Link>
                    </SwiperSlide>
                ))}

                {/* Custom Navigation Buttons */}
                <button className="swiper-btn-prev absolute left-4 top-1/2 -translate-y-1/2 z-20 h-11 w-11 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/40 text-white flex items-center justify-center transition-all duration-200 shadow-lg group">
                    <span className="material-icons-outlined text-xl group-hover:scale-110 transition-transform">chevron_left</span>
                </button>
                <button className="swiper-btn-next absolute right-4 top-1/2 -translate-y-1/2 z-20 h-11 w-11 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/40 text-white flex items-center justify-center transition-all duration-200 shadow-lg group">
                    <span className="material-icons-outlined text-xl group-hover:scale-110 transition-transform">chevron_right</span>
                </button>

                {/* Custom Pagination dots */}
                <div className="swiper-custom-pagination absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2" />
            </Swiper>

            {/* Swiper custom CSS overrides */}
            <style>{`
                .swiper-custom-pagination .swiper-pagination-bullet {
                    width: 2rem;
                    height: 0.375rem;
                    border-radius: 9999px;
                    background: rgba(255,255,255,0.45);
                    opacity: 1;
                    transition: all 0.4s ease;
                    margin: 0 3px;
                }
                .swiper-custom-pagination .swiper-pagination-bullet-active {
                    background: #ffffff;
                    width: 3rem;
                }
                .swiper-btn-prev.swiper-button-disabled,
                .swiper-btn-next.swiper-button-disabled {
                    opacity: 0.35;
                    pointer-events: none;
                }
            `}</style>
        </div>
    );
};

export default BannerSlider;
