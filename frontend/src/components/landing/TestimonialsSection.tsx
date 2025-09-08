import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../atoms';
import { Avatar } from '../atoms';
import { Star, Quote } from 'lucide-react';

export interface TestimonialsSectionProps {
  className?: string;
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ className = '' }) => {
  const testimonials = [
    {
      name: 'Ahmet Yılmaz',
      role: 'Toyota Servis Müdürü',
      company: 'AutoMax Servis',
      avatar: '',
      rating: 5,
      text: 'OtoTakibim sayesinde işletmemizin verimliliği %40 arttı. AI destekli tanı özelliği gerçekten işe yarıyor.',
      location: 'İstanbul'
    },
    {
      name: 'Ayşe Demir',
      role: 'BMW Yetkili Servis Sahibi',
      company: 'Premium Auto',
      avatar: '',
      rating: 5,
      text: 'Müşteri memnuniyetimiz çok arttı. Öngörülü bakım sayesinde müşterilerimiz daha memnun.',
      location: 'Ankara'
    },
    {
      name: 'Mehmet Kaya',
      role: 'Mercedes-Benz Teknisyen',
      company: 'Luxury Motors',
      avatar: '',
      rating: 5,
      text: 'Teknisyen olarak AI önerileri çok faydalı. Daha hızlı ve doğru tanı koyabiliyorum.',
      location: 'İzmir'
    },
    {
      name: 'Fatma Özkan',
      role: 'Honda Servis Müdürü',
      company: 'Speed Auto',
      avatar: '',
      rating: 5,
      text: 'Raporlama özellikleri harika. İşletmemizi çok daha iyi analiz edebiliyoruz.',
      location: 'Bursa'
    },
    {
      name: 'Ali Çelik',
      role: 'Volkswagen Yetkili Servis',
      company: 'German Auto',
      avatar: '',
      rating: 5,
      text: 'Mobil uygulama çok kullanışlı. Her yerden işletmemi takip edebiliyorum.',
      location: 'Antalya'
    },
    {
      name: 'Zeynep Arslan',
      role: 'Ford Servis Sahibi',
      company: 'American Motors',
      avatar: '',
      rating: 5,
      text: 'Maliyetlerimiz %35 azaldı. OtoTakibim gerçekten değerli bir yatırım.',
      location: 'Adana'
    }
  ];

  const stats = [
    { number: '500+', label: 'Mutlu Müşteri' },
    { number: '%95', label: 'Memnuniyet Oranı' },
    { number: '4.9/5', label: 'Ortalama Puan' },
    { number: '24/7', label: 'Destek' }
  ];

  return (
    <section className={`py-20 bg-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Müşterilerimiz Ne Diyor?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Türkiye'nin önde gelen oto servisleri OtoTakibim'i tercih ediyor
          </motion.p>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <div className="relative">
                  <Quote className="absolute -top-2 -left-2 w-8 h-8 text-blue-100" />
                  <div className="pt-4">
                    {/* Rating */}
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>

                    {/* Testimonial Text */}
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      "{testimonial.text}"
                    </p>

                    {/* Author */}
                    <div className="flex items-center">
                      <Avatar
                        name={testimonial.name}
                        size="sm"
                        className="mr-3"
                      />
                      <div>
                        <div className="font-semibold text-gray-900">
                          {testimonial.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {testimonial.role}
                        </div>
                        <div className="text-sm text-gray-500">
                          {testimonial.company} • {testimonial.location}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Siz de Başarı Hikayenizi Yazın
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              OtoTakibim ile işletmenizi bir üst seviyeye taşıyın. 
              Ücretsiz deneme ile başlayın.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Ücretsiz Deneyin
              </button>
              <button className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                Demo İzleyin
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
