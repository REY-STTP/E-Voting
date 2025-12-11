// components/landing/HowItWorks.tsx
import React from 'react';
import { Wallet, Vote, CheckCircle } from 'lucide-react';

interface HowItWorksProps {
  isConnected: boolean;
  onStartVoting: () => void;
  isAdmin?: boolean;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({
  isConnected,
  onStartVoting,
  isAdmin,
}) => {
  const steps = [
    {
      icon: Wallet,
      number: '01',
      title: 'Connect Your Wallet',
      description: 'Hubungkan MetaMask atau wallet EVM Anda untuk memulai',
      color: 'purple',
    },
    {
      icon: Vote,
      number: '02',
      title: 'Choose Your Candidate',
      description: 'Pilih kandidat yang Anda dukung dari daftar yang tersedia',
      color: 'blue',
    },
    {
      icon: CheckCircle,
      number: '03',
      title: 'Vote & Verify',
      description: 'Cast your vote dan verifikasi transaksi di blockchain',
      color: 'green',
    },
  ];

  const colorClasses = {
    purple: 'from-purple-600 to-purple-400',
    blue: 'from-blue-600 to-blue-400',
    green: 'from-green-600 to-green-400',
  };

  const buttonText = !isConnected
    ? 'Start Voting Now'
    : isAdmin
    ? 'Go to Dashboard'
    : 'Go to Voting';

  return (
    <section
      className="
        container mx-auto px-4 py-20 my-20
        bg-white/70 dark:bg-slate-900/70
        rounded-3xl
        border border-gray-100/80 dark:border-slate-800
        shadow-lg dark:shadow-slate-950/40
      "
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-slate-50 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 dark:text-slate-300">
            3 langkah mudah untuk melakukan voting
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 transform -translate-y-1/2 z-0 opacity-70 dark:opacity-90"></div>

          {steps.map((step, index) => (
            <div key={index} className="relative z-10">
              <div
                className="
                  rounded-2xl p-8 
                  bg-white/90 dark:bg-slate-900
                  border border-gray-100/80 dark:border-slate-800
                  shadow-xl dark:shadow-slate-950/40
                  hover:shadow-2xl hover:-translate-y-2
                  transition-all
                "
              >
                <div
                  className={`
                    absolute -top-6 -right-6 w-16 h-16 rounded-full
                    bg-gradient-to-br ${colorClasses[step.color as keyof typeof colorClasses]}
                    text-white font-bold text-2xl
                    flex items-center justify-center
                    shadow-lg
                  `}
                >
                  {step.number}
                </div>
                <div
                  className={`
                    w-16 h-16 rounded-xl mb-6
                    bg-gradient-to-br ${colorClasses[step.color as keyof typeof colorClasses]}
                    flex items-center justify-center
                  `}
                >
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-slate-50 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-slate-300">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-600 dark:text-slate-300 mb-6">
            Ready to make your voice heard?
          </p>
          <button
            onClick={onStartVoting}
            className="
              bg-gradient-to-r from-purple-600 to-blue-600
              text-white px-8 py-4 rounded-xl font-semibold text-lg
              hover:from-purple-700 hover:to-blue-700 transition-all
              shadow-2xl hover:scale-105
            "
          >
            {buttonText}
          </button>
        </div>
      </div>
    </section>
  );
};
