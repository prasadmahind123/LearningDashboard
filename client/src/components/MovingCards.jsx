import React from "react";
import { useAppContext } from "@/context/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

export function MovingCards() {
  const { paths } = useAppContext();

  // Helper to prevent errors if paths is undefined
  const safePaths = paths || [];

  return (
    <section id="paths" className="py-12 md:py-20 px-4 bg-muted/30 overflow-hidden">
      <div className="container mx-auto max-w-7xl mb-8 md:mb-12">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Structured Learning Paths</h2>
          <p className="text-base md:text-lg text-muted-foreground">Choose a path that aligns with your career goals</p>
        </div>
      </div>

      {/* Animated Carousel Container */}
      <div className="relative">
        <style>{`
          @keyframes scroll-right {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-100% - 1rem)); }
          }
          
          @keyframes scroll-left-reverse {
            0% { transform: translateX(calc(-100% - 1rem)); }
            100% { transform: translateX(0); }
          }
          
          .scroll-animation {
            animation: scroll-right 30s linear infinite;
          }
          
          .scroll-animation-reverse {
            animation: scroll-left-reverse 30s linear infinite;
          }
          
          @media (min-width: 768px) {
            .scroll-animation { animation-duration: 25s; }
            .scroll-animation-reverse { animation-duration: 25s; }
          }

          .carousel-container:hover .scroll-animation,
          .carousel-container:hover .scroll-animation-reverse {
            animation-play-state: paused;
          }
        `}</style>

        {/* First Row - Left to Right */}
        <div className="carousel-container mb-4 md:mb-8 overflow-hidden">
          <div className="scroll-animation flex gap-4 md:gap-8">
            {[...safePaths, ...safePaths].map((path, idx) => (
              <Link key={`row1-${idx}`} to={`/courses/learning-path/${path._id}`} className="block">
                <Card
                  className="flex-shrink-0 w-[280px] md:w-96 h-full overflow-hidden hover:shadow-xl transition-all group border-0 cursor-pointer bg-background"
                >
                  <div className="h-40 md:h-48 w-full overflow-hidden">
                    <img 
                      src={path.image} 
                      alt={path.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <CardHeader className="p-4 md:p-6">
                    <CardTitle className="text-lg md:text-xl line-clamp-1">{path.title}</CardTitle>
                    <CardDescription className="line-clamp-2 text-xs md:text-sm h-10">
                      {path.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 pt-0">
                    <div className="flex justify-between text-[10px] md:text-sm">
                      <div>
                        <span className="font-bold text-foreground block">$ {path.price}</span>
                        <p className="text-muted-foreground">Price</p>
                      </div>
                      <div className="text-center">
                        <span className="font-bold block">{path.learners?.length || 0}</span>
                        <p className="text-muted-foreground">Students</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-foreground block">{path.duration}</span>
                        <p className="text-muted-foreground">Duration</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Second Row - Hidden on smallest mobile screens or slowed down */}
        <div className="carousel-container overflow-hidden hidden sm:block">
          <div className="scroll-animation-reverse flex gap-4 md:gap-8">
            {[...safePaths].reverse().concat([...safePaths]).map((path, idx) => (
              <Link key={`row2-${idx}`} to={`/courses/learning-path/${path._id}`} className="block">
                <Card
                  className="flex-shrink-0 w-[280px] md:w-96 h-full overflow-hidden hover:shadow-xl transition-all group border-0 cursor-pointer bg-background"
                >
                  <div className="h-40 md:h-48 w-full overflow-hidden">
                    <img 
                      src={path.image} 
                      alt={path.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <CardHeader className="p-4 md:p-6">
                    <CardTitle className="text-lg md:text-xl line-clamp-1">{path.title}</CardTitle>
                    <CardDescription className="line-clamp-2 text-xs md:text-sm h-10">
                      {path.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 pt-0">
                    <div className="flex justify-between text-[10px] md:text-sm">
                      <div>
                        <span className="font-bold text-foreground block">$ {path.price}</span>
                        <p className="text-muted-foreground">Price</p>
                      </div>
                      <div className="text-center">
                        <span className="font-bold block">{path.learners?.length || 0}</span>
                        <p className="text-muted-foreground">Students</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-foreground block">{path.duration}</span>
                        <p className="text-muted-foreground">Duration</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}