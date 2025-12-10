// components/landing/Features.tsx
import React from 'react';
import { Shield, Lock, Eye, Zap, Globe, CheckCircle } from 'lucide-react';

export const Features: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: 'Blockchain Security',
      description: 'Vote Anda dilindungi oleh teknologi blockchain yang tidak dapat diubah',
      color: 'purple'
    },
    {
      icon: Eye,
      title: 'Transparent & Verifiable',
      description: 'Setiap vote dapat diverifikasi dan hasil voting 100% transparan',
      color: 'blue'
    },
    {
      icon: Lock,
      title: 'Anonymous Voting',
      description: 'Identitas Anda terjaga, hanya wallet address yang tercatat',
      color: 'green'
    },
    {
      icon: Zap,
      title: 'Real-time Results',
      description: 'Lihat hasil voting secara langsung tanpa menunggu',
      color: 'yellow'
    },
    {
      icon: Globe,
      title: 'Decentralized',
      description: 'Tidak ada pihak ketiga yang mengontrol, semua terdesentralisasi',
      color: 'pink'
    },
    {
      icon: CheckCircle,
      title: 'One Vote Per Wallet',
      description: 'Sistem mencegah double voting, satu wallet = satu suara',
      color: 'indigo'
    }
  ];

  const colorClasses = {
    purple: 'bg-purple-100 text-purple-600',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    pink: 'bg-pink-100 text-pink-600',
    indigo: 'bg-indigo-100 text-indigo-600'
  };

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-slate-50 mb-4">
            Why Choose Our Platform?
          </h2>
          <p className="text-xl text-gray-600 dark:text-slate-300">
            Keamanan, transparansi, dan kemudahan dalam satu platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
                key={index}
                className="
                    rounded-xl p-6 
                    shadow-lg hover:shadow-2xl 
                    border border-gray-100/80 
                    bg-white/90 
                    hover:-translate-y-2 
                    transition-all
                    dark:bg-slate-900/80
                    dark:border-slate-700
                    dark:shadow-slate-950/40
                "
                >
                <div
                    className={`
                    w-14 h-14 rounded-lg flex items-center justify-center mb-4
                    ${colorClasses[feature.color as keyof typeof colorClasses]}
                    `}
                >
                    <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-2">
                    {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-slate-300">
                    {feature.description}
                </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};