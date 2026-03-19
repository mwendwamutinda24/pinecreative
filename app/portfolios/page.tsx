'use client';

import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import { useState, useEffect } from "react";

export default function Portfolios() {
  const [dbProjects, setDbProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const res = await fetch("/api/portfolio/list"); 
      const data = await res.json();
      setDbProjects(data);
    };
    fetchProjects();
  }, []);

  const categories = [
    'All',
    'Corporate',
    'Event Coverage',
    'Concerts',
    'Advertisements',
    'Documentaries',
    'Campaigns',
    'Weddings'
  ];

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <span className="bg-orange-600 text-gray-100 px-4 py-2 rounded-full text-sm font-semibold">
                Our Work
              </span>
              <h1 className="text-5xl md:text-6xl font-bold text-black mt-6 mb-6">
                Our Portfolios
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Explore our diverse showcase of creative triumphs and design mastery. 
                Each project represents our commitment to excellence and innovation.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filter Categories */}
        <section className="py-8 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category, index) => (
                <motion.button
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`px-6 py-2 rounded-full transition-all duration-200 ${
                    index === 0 
                      ? 'bg-black text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio Grid */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {dbProjects.map((project, index) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="group bg-gray-50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    {project.images?.length ? (
                      <Image
                        src={project.images[0]}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : project.videos?.length ? (
                      <video
                        src={project.videos[0]}
                        controls
                        className="object-cover w-full h-full"
                      />
                    ) : null}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-orange-600 text-sm font-semibold">{project.category || "Portfolio"}</span>
                      <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-black transition-all duration-200" />
                    </div>
                    <h3 className="text-xl font-bold text-black mb-3 group-hover:text-orange-600 transition-colors duration-200">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags?.map((tag: string) => (
                        <span key={tag} className="px-3 py-1 bg-white text-gray-600 text-sm rounded-full border border-gray-200">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Detail Modal */}
        {selectedProject && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full p-6 overflow-y-auto max-h-[90vh]">
              <button
                className="text-gray-600 hover:text-black mb-4"
                onClick={() => setSelectedProject(null)}
              >
                Close ✕
              </button>
              <h2 className="text-2xl font-bold mb-4">{selectedProject.title}</h2>
              <p className="text-gray-600 mb-4">{selectedProject.description}</p>

              {/* Render all images */}
              {selectedProject.images?.map((img: string, i: number) => (
                <Image
                  key={i}
                  src={img}
                  alt={`${selectedProject.title} image ${i+1}`}
                  width={800}
                  height={450}
                  className="rounded-lg mb-4 object-cover"
                />
              ))}

              {/* Render all videos */}
              {selectedProject.videos?.map((vid: string, i: number) => (
                <video
                  key={i}
                  src={vid}
                  controls
                  className="rounded-lg w-full mb-4"
                />
              ))}

              {selectedProject.link && (
                <a
                  href={selectedProject.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-orange-600 font-medium mt-3 hover:underline"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  View Project
                </a>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
