const Hero = () => {
    return (
        <section className="relative">
            <div className="absolute w-full h-full bg-black opacity-50 z-10">Hello</div>
            <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-[40rem] object-cover z-0"
            >
                <source src="/images/hero.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="z-20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white">
                <h1 className="text-6xl font-extrabold text-yellow-400">Play Pickup or Join a Tournament</h1>
                <p className="text-xl mt-7">Jump into a team and battle it out in a tournament. Reserve your spot and bring your A-game!</p>
                <button className="hover:bg-white hover:text-yellow-400 transition:hover duration-300 mt-6 text-3xl p-3 w-[16rem] rounded font-semibold bg-yellow-600">JOIN NOW</button>
            </div>
        </section>
    );
}

export default Hero;