import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';
import 'swiper/css/scrollbar';
import { Pagination } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
const Slider = () => {
    const navigate = useNavigate();
    const slidesData = [
        {
            imgSrc: "/images/slider-tournament.jpg",
            title: "Join Competitive Tournaments",
            description: "Test your skills and compete with top teams in exciting bracket-based tournaments. Win, level up, and become a local champion.",
        },
        {
            imgSrc: "/images/slider-friendly.webp",
            title: "Create your team",
            description: " Ready to lead? Build your own team, recruit players, and register for tournaments as a manager or captain.",
        },
        {
            imgSrc: "/images/slider-jointeam.jpg",
            title: "Find & Join Teams",
            description: "Discover local teams looking for players just like you. Filter by skill level, location, and schedule to join the perfect squad.",
        }
    ];
    return (
        <Swiper
            className='w-full h-[35rem] mt-16'
            modules={[Pagination]}
            spaceBetween={10}
            pagination={{ clickable: true }}
            slidesPerView={'auto'}
            onSlideChange={() => console.log('slide change')}
            slideToClickedSlide
        >
            {
                slidesData.map((slide, index) => (
                    <SwiperSlide className='!w-[60rem] ml-36' key={index}>
                        <div className='flex gap-8'>
                            <img className='!rounded-2xl w-[30rem] h-[30rem] object-contain' src={slide.imgSrc} />
                            <div className='flex flex-col ml-8 justify-center gap-7'>
                                <h2 className='font-extrabold text-[2.5rem] leading-tight '>{slide.title}</h2>
                                <p className='text-gray-700'>{slide.description}</p>
                                <button onClick={() => navigate("/create-account")} className='bg-yellow-500 hover:bg-yellow-600 transition duration-250 text-white w-[8rem] h-[3rem] rounded-full font-bold'>Try now</button>
                            </div>
                        </div>
                    </SwiperSlide>
                ))
            }
        </Swiper>
    );
}

export default Slider;