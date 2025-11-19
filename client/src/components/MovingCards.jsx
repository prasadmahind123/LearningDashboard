
import React from "react";
import  InfiniteMovingCards  from "./ui/infinite-moving-cards";
import { useAppContext } from "@/context/AppContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function MovingCards() {
    const { paths } = useAppContext();
  return (
    <section id="paths" className="py-20 px-4 bg-muted/30 overflow-hidden">
        <div className="container mx-auto max-w-7xl mb-12">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Structured Learning Paths</h2>
            <p className="text-lg text-muted-foreground">Choose a path that aligns with your career goals</p>
          </div>
        </div>

        {/* Animated Carousel Container */}
        <div className="relative">
          <style>{`
            @keyframes scroll-right {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(calc(-100% - 2rem));
              }
            }
            
            @keyframes scroll-left-reverse {
              0% {
                transform: translateX(calc(-100% - 2rem));
              }
              100% {
                transform: translateX(0);
              }
            }
            
            .scroll-animation {
              animation: scroll-right 20s linear infinite;
            }
            
            .scroll-animation-reverse {
              animation: scroll-left-reverse 20s linear infinite;
            }
            
            .carousel-container:hover .scroll-animation,
            .carousel-container:hover .scroll-animation-reverse {
              animation-play-state: paused;
            }
          `}</style>

          {/* First Row - Left to Right */}
        
          <div className="carousel-container mb-8 overflow-hidden">
            <div className="scroll-animation flex gap-8">
              {[...paths, ...paths].map((path, idx) => (
                <Link to={`/courses/learning-path/${path._id}`}>
                  <Card
                    key={idx}
                    className="flex-shrink-0 w-96 h-full overflow-hidden hover:shadow-xl transition-all group border-0 cursor-pointer"
                  >
                    <div
                      className={`h-48 w-full bg-gradient-to-br opacity-90 group-hover:opacity-100 transition-opacity`}
                    >
                      <img src={path.image} alt="" />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl py-2">{path.title}</CardTitle>
                      <CardDescription>{path.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-6 text-sm">
                        <div>
                          <span className="font-semibold text-foreground">$ {path.price}</span>
                          <p className="text-muted-foreground">Price</p>
                        </div>
                        <div>
                          <span className="font-semibold text-center">{path.learners?.length}</span>
                          <p className="text-muted-foreground">Students</p>
                        </div>
                        <div>
                          <span className="font-semibold text-foreground">{path.duration}</span>
                          <p className="text-muted-foreground">Duration</p>
                        </div>
                      </div>
                    </CardContent>

                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Second Row - Right to Left (Reverse) */}
          <div className="carousel-container overflow-hidden">
            <div className="scroll-animation-reverse flex gap-8">
              {[...paths.reverse(), ...paths].map((path, idx) => (
                <Link to={`/courses/learning-path/${path._id}`}>
                  <Card
                    key={idx}
                    className="flex-shrink-0 w-96 h-full overflow-hidden hover:shadow-xl transition-all group border-0 cursor-pointer"
                  >
                    <div
                      className={`h-48 w-full bg-gradient-to-br opacity-90 group-hover:opacity-100 transition-opacity`}
                    >
                      <img src={path.image} alt="" />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl">{path.title}</CardTitle>
                      <CardDescription>{path.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-6 text-sm">
                        <div>
                          <span className="font-semibold text-foreground">$ {path.price}</span>
                          <p className="text-muted-foreground">Price</p>
                        </div>
                        <div>
                          <span className="font-semibold text-center">{path.learners?.length}</span>
                          <p className="text-muted-foreground">Students</p>
                        </div>
                        <div>
                          <span className="font-semibold text-foreground">{path.duration}</span>
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


