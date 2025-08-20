"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function CrayfluxLanding() {
  const heroRef = useRef<HTMLDivElement>(null)
  const aboutRef = useRef<HTMLDivElement>(null)
  const portfolioRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Polygon vertices that will move and connect
    const polygons: Array<{
      x: number
      y: number
      vx: number
      vy: number
      connections: number[]
    }> = []

    // Create random polygon vertices
    for (let i = 0; i < 50; i++) {
      polygons.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        connections: [],
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update polygon positions
      polygons.forEach((polygon) => {
        polygon.x += polygon.vx
        polygon.y += polygon.vy

        // Bounce off edges
        if (polygon.x <= 0 || polygon.x >= canvas.width) polygon.vx *= -1
        if (polygon.y <= 0 || polygon.y >= canvas.height) polygon.vy *= -1
      })

      // Draw connections between nearby polygons
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
      ctx.lineWidth = 1

      for (let i = 0; i < polygons.length; i++) {
        for (let j = i + 1; j < polygons.length; j++) {
          const dx = polygons[i].x - polygons[j].x
          const dy = polygons[i].y - polygons[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            const opacity = ((150 - distance) / 150) * 0.2
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`
            ctx.beginPath()
            ctx.moveTo(polygons[i].x, polygons[i].y)
            ctx.lineTo(polygons[j].x, polygons[j].y)
            ctx.stroke()
          }
        }
      }

      // Draw polygon vertices
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
      polygons.forEach((polygon) => {
        ctx.beginPath()
        ctx.arc(polygon.x, polygon.y, 2, 0, Math.PI * 2)
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset
      const parallax = heroRef.current
      if (parallax) {
        const speed = scrolled * 0.5
        parallax.style.transform = `translateY(${speed}px)`
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up")
          }
        })
      },
      { threshold: 0.1 },
    )

    const elements = document.querySelectorAll(".fade-in-on-scroll")
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Hero Section with Animated Polygon Background */}
      <section className="relative h-screen flex items-center justify-center">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }} />

        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <div className="space-y-8">
            <nav className="flex justify-between items-center mb-16">
              <div className="text-2xl font-bold">Crayflux</div>

              {/* Desktop Navigation Menu */}
              <div className="hidden md:flex items-center space-x-8">
                <button
                  onClick={() => scrollToSection(aboutRef)}
                  className="text-white hover:text-orange-500 transition-colors duration-300 font-medium"
                >
                  About
                </button>
                <button
                  onClick={() => scrollToSection(portfolioRef)}
                  className="text-white hover:text-orange-500 transition-colors duration-300 font-medium"
                >
                  Portfolio
                </button>
                <Button
                  variant="outline"
                  className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black transition-all duration-300 bg-transparent"
                  onClick={() => {
                    const contactSection = document.querySelector("section:nth-last-child(2)")
                    contactSection?.scrollIntoView({ behavior: "smooth" })
                  }}
                >
                  Contact
                </Button>
              </div>

              {/* Mobile Menu Button */}
              <button className="md:hidden flex flex-col space-y-1">
                <div className="w-6 h-0.5 bg-white"></div>
                <div className="w-6 h-0.5 bg-white"></div>
                <div className="w-6 h-0.5 bg-white"></div>
              </button>
            </nav>

            {/* Main heading */}
            <div className="space-y-4">
              <h1 className="text-6xl md:text-8xl font-light leading-tight">
                Designing <span className="text-gray-400">a Better</span>
                <br />
                World <span className="text-gray-400">Today</span>
              </h1>

              <p className="text-gray-400 text-lg max-w-2xl leading-relaxed mt-8">
                Welcome to our world of endless imagination and boundless creativity. Together, let's embark on a
                remarkable journey where dreams become tangible realities.
              </p>
            </div>

            <div className="flex items-center space-x-6 mt-12">
              <Button
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-black font-medium px-8 py-4 rounded-full transition-all duration-300"
                onClick={() => scrollToSection(aboutRef)}
              >
                WHAT WE DO →
              </Button>

              <Button
                variant="ghost"
                className="text-white hover:text-orange-500 font-medium transition-colors duration-300"
                onClick={() => scrollToSection(portfolioRef)}
              >
                VIEW WORKS →
              </Button>
            </div>
          </div>

          <div className="absolute bottom-8 right-8 flex items-center justify-center">
            <button
              onClick={() => scrollToSection(aboutRef)}
              className="w-16 h-16 border-2 border-orange-500 rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-black transition-all duration-300 group"
            >
              <div className="flex flex-col items-center space-y-1">
                <span className="text-xs font-medium transform rotate-90 origin-center whitespace-nowrap">
                  SCROLL DOWN
                </span>
                <div className="w-0.5 h-4 bg-current group-hover:h-6 transition-all duration-300"></div>
              </div>
            </button>
          </div>
        </div>

        {/* Side text */}
        <div className="absolute left-6 top-1/2 transform -rotate-90 origin-left">
          <span className="text-sm text-gray-500 tracking-widest">HOMEPAGE</span>
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} className="py-24 px-6 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="fade-in-on-scroll space-y-6">
              <h2 className="font-sans text-4xl md:text-5xl font-bold">
                Crafting Digital
                <span className="text-accent block">Experiences</span>
              </h2>
              <p className="font-serif text-lg text-muted-foreground leading-relaxed">
                At Crayflux, we blend creativity with cutting-edge technology to create digital experiences that
                captivate and inspire. Our team of passionate designers and developers push the boundaries of what's
                possible.
              </p>
              <Button
                variant="outline"
                className="border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-transparent"
              >
                Learn More
              </Button>
            </div>

            <div className="fade-in-on-scroll relative">
              <div className="aspect-square bg-gradient-to-br from-accent/20 to-transparent rounded-2xl p-8">
                <div className="w-full h-full bg-card rounded-xl flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-accent rounded-full mx-auto animate-pulse" />
                    <p className="font-serif text-sm text-muted-foreground">Creative Process</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Showcase */}
      <section ref={portfolioRef} className="py-24 px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 fade-in-on-scroll">
            <h2 className="font-sans text-4xl md:text-5xl font-bold mb-6">
              Our <span className="text-accent">Portfolio</span>
            </h2>
            <p className="font-serif text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our latest projects that showcase innovation, creativity, and technical excellence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Card
                key={item}
                className="fade-in-on-scroll group cursor-pointer overflow-hidden bg-card border-border hover:border-accent/50 transition-all duration-300"
              >
                <div className="aspect-video bg-gradient-to-br from-accent/10 to-card relative overflow-hidden">
                  <img
                    src={`/modern-design-project.png?height=300&width=400&query=modern design project ${item} creative portfolio`}
                    alt={`Project ${item}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-center text-white">
                      <h3 className="font-sans text-xl font-bold mb-2">Project {item}</h3>
                      <p className="font-serif text-sm">Creative Design Solution</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <div className="fade-in-on-scroll space-y-8">
            <h2 className="font-sans text-4xl md:text-5xl font-bold text-muted-foreground">What Clients Say</h2>

            <blockquote className="text-2xl md:text-3xl font-serif italic text-muted-foreground leading-relaxed">
              "Crayflux transformed our vision into a stunning digital reality. Their attention to detail and innovative
              approach exceeded all expectations."
            </blockquote>

            <div className="flex items-center justify-center space-x-4">
              <div className="w-12 h-12 bg-accent rounded-full" />
              <div className="text-left">
                <p className="font-sans font-semibold text-muted-foreground">Sarah Johnson</p>
                <p className="font-serif text-sm text-muted-foreground/70">CEO, TechStart Inc.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-2xl mx-auto text-center">
          <div className="fade-in-on-scroll space-y-8">
            <h2 className="font-sans text-4xl md:text-5xl font-bold">
              Let's Create
              <span className="text-accent block">Together</span>
            </h2>

            <p className="font-serif text-lg text-muted-foreground">
              Ready to bring your vision to life? Get in touch and let's discuss your next project.
            </p>

            <div className="space-y-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-6 py-4 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent font-serif"
              />
              <Button
                size="lg"
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-serif text-lg py-4"
              >
                Start Your Project
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 px-6 bg-gray-900 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Brand Section */}
            <div className="space-y-4">
              <h3 className="font-sans text-2xl font-bold">CRAYFLUX</h3>
              <p className="font-serif text-sm text-muted-foreground">
                Designing a better world through innovative digital experiences.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="font-sans font-semibold text-white">Quick Links</h4>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => scrollToSection(aboutRef)}
                  className="font-serif text-sm text-muted-foreground hover:text-orange-500 transition-colors duration-300 text-left"
                >
                  About Us
                </button>
                <button
                  onClick={() => scrollToSection(portfolioRef)}
                  className="font-serif text-sm text-muted-foreground hover:text-orange-500 transition-colors duration-300 text-left"
                >
                  Our Work
                </button>
                <a
                  href="#contact"
                  className="font-serif text-sm text-muted-foreground hover:text-orange-500 transition-colors duration-300"
                >
                  Get In Touch
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h4 className="font-sans font-semibold text-white">Follow Us</h4>
              <div className="flex flex-col space-y-2">
                {["Instagram", "Dribbble", "Behance", "LinkedIn"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="font-serif text-sm text-muted-foreground hover:text-orange-500 transition-colors duration-300"
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="font-serif text-sm text-muted-foreground">
              © 2024 Crayflux Design Studio. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
