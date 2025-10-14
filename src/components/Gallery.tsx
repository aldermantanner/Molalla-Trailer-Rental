export function Gallery() {
  const galleryImages = [
    {
      src: '/image copy copy copy copy copy.png',
      alt: 'Professional trailer service',
      category: 'Our Fleet'
    },
    {
      src: '/image copy copy copy copy copy copy copy copy.png',
      alt: 'Junk removal project',
      category: 'Junk Removal'
    },
    {
      src: '/image copy copy copy copy copy copy copy copy copy.png',
      alt: 'Construction debris removal',
      category: 'Construction'
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-slate-800 mb-4">
          Our Work in Action
        </h2>
        <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
          See our professional dump trailers serving Molalla and surrounding areas. From junk removal to material delivery, we handle projects of all sizes.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="group relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="inline-block bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {image.category}
                  </span>
                  <p className="text-white mt-2 text-sm">{image.alt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <p className="text-gray-600 text-lg mb-4">
            Ready to start your project? Our professional trailers are available for daily, weekly, or monthly rentals.
          </p>
          <a
            href="tel:503-500-6121"
            className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg"
          >
            Call Now: 503-500-6121
          </a>
        </div>
      </div>
    </section>
  );
}
