import React from 'react';
import { Link } from 'react-router-dom';
import { buttonVariants } from '../components/ui/button';
import { cn } from '../lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';

const Home = () => {
  return (
    <>
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="bg-dark-card/50 backdrop-blur-md border border-primary/10 rounded-xl p-10 mb-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-30"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Build Your Dream PC with BuildGenie</h1>
            <p className="text-xl mb-10 text-gray-300 font-light">Your personal assistant for creating the perfect custom PC build. Select components, compare prices, and build with confidence.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/builder"
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'font-bold px-8 py-6 text-lg'
                )}
              >
                Start Building
              </Link>
              {/* Removed Gaming Builds button as requested */}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Why Choose BuildGenie?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-dark-card/60 backdrop-blur-sm border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(138,43,226,0.15)]">
              <CardHeader>
                <div className="text-primary text-4xl mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-12 w-12 mx-auto">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
                <CardTitle className="text-center text-xl">Custom PC Builder</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-400 font-light">
                  Our intuitive builder tool helps you select compatible components and create your perfect PC build with ease.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-dark-card/60 backdrop-blur-sm border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(138,43,226,0.15)]">
              <CardHeader>
                <div className="text-primary text-4xl mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-12 w-12 mx-auto">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <CardTitle className="text-center text-xl">Expert Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-400 font-light">
                  Get personalized recommendations based on your budget, usage needs, and performance requirements.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-dark-card/60 backdrop-blur-sm border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(138,43,226,0.15)]">
              <CardHeader>
                <div className="text-primary text-4xl mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-12 w-12 mx-auto">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <CardTitle className="text-center text-xl">Price Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-400 font-light">
                  Find the best value components that meet your performance needs without breaking your budget.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-10 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="text-center p-6 bg-dark-card/40 backdrop-blur-sm rounded-xl border border-primary/10 hover:border-primary/30 transition-all duration-300">
                    <div className="bg-gradient-to-br from-primary to-primary/70 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold shadow-[0_0_15px_rgba(138,43,226,0.3)]">1</div>
                    <h3 className="text-xl font-bold mb-2 text-white">Select Components</h3>
                    <p className="text-gray-400 font-light">Choose from our wide range of PC components.</p>
                </div>
                <div className="text-center p-6 bg-dark-card/40 backdrop-blur-sm rounded-xl border border-primary/10 hover:border-primary/30 transition-all duration-300">
                    <div className="bg-gradient-to-br from-primary to-primary/70 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold shadow-[0_0_15px_rgba(138,43,226,0.3)]">2</div>
                    <h3 className="text-xl font-bold mb-2 text-white">Check Compatibility</h3>
                    <p className="text-gray-400 font-light">Our system verifies all parts work together.</p>
                </div>
                <div className="text-center p-6 bg-dark-card/40 backdrop-blur-sm rounded-xl border border-primary/10 hover:border-primary/30 transition-all duration-300">
                    <div className="bg-gradient-to-br from-primary to-primary/70 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold shadow-[0_0_15px_rgba(138,43,226,0.3)]">3</div>
                    <h3 className="text-xl font-bold mb-2 text-white">Review Build</h3>
                    <p className="text-gray-400 font-light">See performance metrics and total cost.</p>
                </div>
                <div className="text-center p-6 bg-dark-card/40 backdrop-blur-sm rounded-xl border border-primary/10 hover:border-primary/30 transition-all duration-300">
                    <div className="bg-gradient-to-br from-primary to-primary/70 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold shadow-[0_0_15px_rgba(138,43,226,0.3)]">4</div>
                    <h3 className="text-xl font-bold mb-2 text-white">Build Your PC</h3>
                    <p className="text-gray-400 font-light">Get your parts list and assembly guide.</p>
                </div>
            </div>
        </section>


        {/* Pre-built Options */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Pre-built PC Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-dark-card/60 backdrop-blur-sm border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(138,43,226,0.15)]">
              <CardHeader>
                <CardTitle className="text-xl">Budget PC</CardTitle>
                <CardDescription className="text-gray-400 font-light">Affordable yet capable builds</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 font-light mb-4">Great performance for everyday tasks and casual gaming at a lower price point.</p>
                <p className="font-bold text-lg text-primary">Starting at $599</p>
              </CardContent>
              <CardFooter>
                <Link
                  to="/budget-build"
                  className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}
                >
                  View Options
                </Link>
              </CardFooter>
            </Card>
            
            <Card className="bg-dark-card/60 backdrop-blur-sm border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(138,43,226,0.15)]">
              <CardHeader>
                <CardTitle className="text-xl">Office PC</CardTitle>
                <CardDescription className="text-gray-400 font-light">Reliable business computers</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 font-light mb-4">Stable and efficient systems for productivity and business applications.</p>
                <p className="font-bold text-lg text-primary">Starting at $699</p>
              </CardContent>
              <CardFooter>
                <Link
                  to="/office-build"
                  className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}
                >
                  View Options
                </Link>
              </CardFooter>
            </Card>
            
            <Card className="bg-dark-card/60 backdrop-blur-sm border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(138,43,226,0.15)]">
              <CardHeader>
                <CardTitle className="text-xl">Workstation</CardTitle>
                <CardDescription className="text-gray-400 font-light">Professional-grade systems</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 font-light mb-4">High-end components for content creation, 3D rendering, and development.</p>
                <p className="font-bold text-lg text-primary">Starting at $1499</p>
              </CardContent>
              <CardFooter>
                <Link
                  to="/workstation-build"
                  className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}
                >
                  View Options
                </Link>
              </CardFooter>
            </Card>
          </div>
        </section>

         {/* CTA Section */}
        <section className="bg-dark-card/60 backdrop-blur-md border border-primary/10 rounded-xl p-10 text-center relative overflow-hidden mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-30"></div>
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Ready to Build Your Dream PC?</h2>
                <p className="text-xl mb-6 text-gray-300 font-light">Start your custom PC build today with BuildGenie's easy-to-use interface.</p>
                <Link
                  to="/builder"
                  className={cn(buttonVariants({ size: 'lg' }), 'px-8 py-6 text-lg')}
                >
                  Get Started Now
                </Link>
            </div>
        </section>
      </div>
    </>
  );
};

export default Home;

