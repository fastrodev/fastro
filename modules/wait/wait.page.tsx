import { useEffect, useState } from "preact/hooks";
import { useTypingAnimation } from "@app/hooks/useTypingAnimation.ts";
import { JSX } from "preact/jsx-runtime";
import { getIconForHeading } from "@app/components/icons/CategoryIcons.tsx";
import { PageProps } from "@app/mod.ts";
import { Footer } from "@app/components/footer.tsx";
import Header from "@app/components/header.tsx";

export default function Wait({ data }: PageProps<
  {
    user: string;
    title: string;
    description: string;
    baseUrl: string;
    new: string;
    destination: string;
    isLogin: boolean;
    avatar_url: string;
    html_url: string;
  }
>) {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [headingIndex, setHeadingIndex] = useState(0); // Changed from 1 to 0
  const [gradientPosition, setGradientPosition] = useState({ x: 50, y: 50 }); // Update initial position to center
  const [showAnswer, setShowAnswer] = useState(true); // Changed to true
  const [showCTA, setShowCTA] = useState(true); // Changed to true
  const [nextQueued, setNextQueued] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);

  // Add initialText state
  const [initialRender, setInitialRender] = useState(true);

  // Add useEffect to handle initial render
  useEffect(() => {
    if (initialRender) {
      setInitialRender(false);
    }
  }, []);

  const headings = [
    [
      "Data Gudang dan Purchasing Terpisah?",
      "Integrasi sistem gudang dan purchasing",
      "Lihat fitur integrasi",
      getIconForHeading("Integrasi", isDark),
    ],
    [
      "Kesulitan Bandingkan Harga Supplier?",
      "Price comparison otomatis",
      "Lihat analisis perbandingan",
      getIconForHeading("Compare", isDark),
    ],
    [
      "Masih Pakai Spreadsheet untuk Stok?",
      "Upgrade ke sistem inventaris modern",
      "Coba demo gratis sekarang",
      getIconForHeading("Spreadsheet", isDark),
    ],
    [
      "Pembelian Barang Masih Manual?",
      "Automasi proses purchasing",
      "Lihat fitur purchasing",
      getIconForHeading("Manual", isDark),
    ],
    [
      "Sering Salah Hitung Harga Pokok?",
      "Kalkulasi otomatis landed cost",
      "Coba kalkulasi biaya",
      getIconForHeading("Salah", isDark),
    ],
    [
      "Kesulitan Cek Stok di Cabang?",
      "Monitoring multi-cabang",
      "Demo monitoring cabang",
      getIconForHeading("Cabang", isDark),
    ],
    [
      "Susah banget bikin PO?",
      "Automasi pembuatan PO",
      "Lihat fitur pembuatan PO",
      getIconForHeading("PO", isDark),
    ],
    [
      "Kesulitan Tracking Barang Manual?",
      "Otomatisasi dengan barcode scanner",
      "Lihat demo scan barcode",
      getIconForHeading("Barcode", isDark),
    ],
    [
      "Stok Fisik Sering Tidak Cocok?",
      "Real-time stock opname system",
      "Mulai stock opname digital",
      getIconForHeading("Opname", isDark),
    ],
    [
      "Sering Kehabisan Stok Mendadak?",
      "Notifikasi minimum stok otomatis",
      "Aktifkan alert stok minimum",
      getIconForHeading("Habis", isDark),
    ],
    [
      "Bingung Monitor Multi-Cabang?",
      "Satu dashboard untuk semua lokasi",
      "Demo monitoring multi-cabang",
      getIconForHeading("Cabang", isDark),
    ],
    [
      "Purchase Order Manual Berantakan?",
      "Automasi PO dengan approval system",
      "Lihat workflow PO digital",
      getIconForHeading("Berantakan", isDark),
    ],
    [
      "Laporan Purchasing Tidak Akurat?",
      "Laporan real-time dengan analitik",
      "Coba template laporan otomatis",
      getIconForHeading("Akurat", isDark),
    ],
    [
      "Supplier Performance Tidak Terukur?",
      "Scoring dan evaluasi supplier",
      "Demo evaluasi supplier",
      getIconForHeading("Score", isDark),
    ],
    [
      "Budget Purchasing Sering Over?",
      "Kontrol budget dengan limit system",
      "Aktifkan kontrol budget",
      getIconForHeading("Over", isDark),
    ],
    [
      "Data Harga Supplier Berantakan?",
      "Katalog supplier terorganisir",
      "Lihat manajemen katalog",
      getIconForHeading("Berantakan", isDark),
    ],
    [
      "Proses Approval PO Lama?",
      "Mobile approval dalam 1 klik",
      "Coba approval system",
      getIconForHeading("Approval", isDark),
    ],
    [
      "Dokumen Purchase Sering Hilang?",
      "Arsip digital terintegrasi",
      "Demo document management",
      getIconForHeading("Hilang", isDark),
    ],

    [
      "Retur Barang Tidak Terorganisir?",
      "Sistem retur barang sistematis",
      "Coba sistem retur digital",
      getIconForHeading("Retur", isDark),
    ],
    [
      "Forecast Stok Sering Meleset?",
      "AI predictive inventory",
      "Demo prediksi kebutuhan stok",
      getIconForHeading("Forecast", isDark),
    ],
    [
      "Kesulitan Cek Status PO?",
      "Tracking PO real-time",
      "Lihat status tracking PO",
      getIconForHeading("Purchase", isDark),
    ],
    [
      "Banyak Barang Slow-Moving?",
      "Analisis perputaran stok",
      "Coba analisis inventory aging",
      getIconForHeading("Moving", isDark),
    ],
    [
      "Proses Receiving Lama?",
      "Receiving system dengan mobile scan",
      "Demo receiving digital",
      getIconForHeading("Receiving", isDark),
    ],
    [
      "Cost Analysis Tidak Akurat?",
      "Perhitungan landed cost otomatis",
      "Lihat kalkulasi biaya detail",
      getIconForHeading("Akurat", isDark),
    ],
    [
      "Data Tersebar di Banyak Sistem?",
      "Satu platform terintegrasi",
      "Demo sistem all-in-one",
      getIconForHeading("Integrasi", isDark),
    ],
  ];

  // Heading animation - update timing
  const { displayText: headingText } = useTypingAnimation({
    text: !initialRender ? headings[headingIndex][0] : headings[0][0],
    shouldType: isAnimating && !initialRender,
    minDelay: 20,
    maxDelay: 40,
    onComplete: () => {
      if (isAnimating) {
        setShowAnswer(true); // Remove setTimeout
      }
    },
  });

  // Answer animation - update timing
  const { displayText: answerText } = useTypingAnimation({
    text: !initialRender ? headings[headingIndex][1] : headings[0][1],
    shouldType: showAnswer && isAnimating && !initialRender,
    minDelay: 20,
    maxDelay: 35,
    onComplete: () => {
      if (isAnimating) {
        setShowCTA(true); // Remove setTimeout
      }
    },
  });

  // CTA animation
  const { displayText: ctaText } = useTypingAnimation({
    text: showAnswer && !initialRender
      ? headings[headingIndex][2]
      : headings[0][2],
    shouldType: showCTA && isAnimating && !initialRender,
    minDelay: 10,
    maxDelay: 30,
    onComplete: () => {
      if (isAnimating) {
        setTimeout(() => {
          setNextQueued(true);
        }, 300);
      }
    },
  });

  // Handle next heading transition - shorter pause between cycles
  useEffect(() => {
    let timeoutId: number;

    const moveToNextHeading = () => {
      setShowAnswer(false);
      setShowCTA(false);
      setNextQueued(false);
      setHeadingIndex((prev) => (prev + 1) % headings.length);
    };

    if (nextQueued && isAnimating) {
      timeoutId = setTimeout(moveToNextHeading, 2000); // Reduced from 3000
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [nextQueued, isAnimating, headings.length]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      setIsAnimating(false);
    };
  }, []);

  // Reset states when heading changes
  useEffect(() => {
    if (isAnimating) {
      setShowAnswer(false);
      setShowCTA(false);
      setNextQueued(false);
    }
  }, [headingIndex, isAnimating]);

  // Update the gradient movement effect
  useEffect(() => {
    const speed = 0.3; // Increased from 0.02 to 0.1
    const centerX = 50; // Keep X position fixed at center
    const minY = 30; // Minimum Y position
    const maxY = 70; // Maximum Y position
    let direction = 1; // 1 for moving down, -1 for moving up
    let currentY = 50; // Start from center

    const interval = setInterval(() => {
      setGradientPosition(() => {
        // Calculate new Y position
        let newY = currentY + (speed * direction);

        // Change direction when reaching boundaries
        if (newY >= maxY) {
          direction = -1;
          newY = maxY;
        } else if (newY <= minY) {
          direction = 1;
          newY = minY;
        }

        currentY = newY;

        return {
          x: centerX,
          y: newY,
        };
      });
    }, 30); // Reduced interval from 50ms to 30ms for smoother animation

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: JSX.TargetedEvent<HTMLFormElement, Event>) => {
    e.preventDefault();
    if (email) {
      try {
        const response = await fetch("/api/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        if (response.ok) {
          console.log("Email submitted successfully:", email);
          setIsSubmitted(true);
          setEmail("");
        } else {
          console.error("Failed to submit email");
          // Optionally handle error state here
        }
      } catch (error) {
        console.error("Error submitting email:", error);
        // Optionally handle error state here
      }
    }
  };

  // Replace handleChange function
  const handleChange = (e: { currentTarget: { value: string } }) => {
    setEmail(e.currentTarget.value);
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  // Update the theme styles to separate main background and card background
  const themeStyles = {
    background: isDark
      ? `radial-gradient(circle at ${gradientPosition.x}% ${gradientPosition.y}%, 
      #581c87 0%,   /* Darker purple */
      #000000 60%)` /* Pure black */
      : "#f8fafc", /* Single light gray color */
    cardBg: isDark
      ? "bg-gray-900/95" // Slightly more transparent for better glow effect
      : "bg-white/95",
    text: isDark ? "text-gray-100" : "text-gray-800",
    input: isDark
      ? "bg-gray-700/30 border-gray-600 text-white placeholder-gray-400"
      : "bg-gray-100/70 border-gray-300 text-gray-900 placeholder-gray-500",
    button: isDark
      ? "bg-blue-600 hover:bg-blue-700"
      : "bg-blue-500 hover:bg-blue-600",
    footer: isDark ? "text-gray-400" : "text-gray-600",
    link: isDark
      ? "text-blue-400 hover:text-blue-300"
      : "text-blue-600 hover:text-blue-500",
    answer: isDark ? "text-gray-100" : "text-gray-700", // Added specific color for answers
    cta: isDark ? "text-gray-100" : "text-gray-700", // Consistent gradient for CTA
    cardGlow: isDark
      ? "shadow-[0_0_100px_rgba(168,85,247,0.5),0_0_50px_rgba(255,255,255,0.15)] hover:shadow-[0_0_150px_rgba(168,85,247,0.6),0_0_80px_rgba(255,255,255,0.2)] border-white/20"
      : "shadow-[0_0_60px_rgba(0,0,0,0.2)] hover:shadow-[0_0_80px_rgba(0,0,0,0.25)] border-gray-300/50",
    header: isDark ? "text-gray-100" : "text-gray-800",
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Layers Group */}
      <div className="fixed inset-0 z-0">
        {/* Gradient Background */}
        <div
          className="absolute inset-0 transition-all duration-[3000ms] ease-in-out"
          style={{
            background: themeStyles.background,
          }}
        />

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 z-[1]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
              linear-gradient(to right, ${
                isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.05)"
              } 1px, transparent 1px),
              linear-gradient(to bottom, ${
                isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.05)"
              } 1px, transparent 1px)
            `,
              backgroundSize: "20px 20px",
            }}
          />
        </div>
      </div>

      {/* Content Layer */}
      <div className="relative z-10 w-full max-w-xl mx-auto min-h-screen flex flex-col">
        <Header
          isLogin={data.isLogin}
          avatar_url={data.avatar_url}
          html_url={data.html_url}
          isDark={isDark}
        />
        <div
          className={`flex-grow flex flex-col 
            backdrop-blur-lg ${themeStyles.cardBg}
            border ${isDark ? "border-white/10" : "border-gray-200/30"}
            rounded-2xl 
            ${themeStyles.cardGlow}
            transition-all duration-300 ease-in-out
            p-6 sm:p-8
            ${themeStyles.text}
            relative z-20
            hover:border-opacity-50
            `}
        >
          {!isSubmitted
            ? (
              <div className="flex flex-col flex-1 min-h-[600px]">
                {/* Content Section - Top */}
                <div className="flex-initial">
                  <div className="max-w-2xl w-full">
                    <div className="px-8 flex flex-col gap-y-8">
                      <h2
                        className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight
                      ${
                          isDark
                            ? "bg-gradient-to-br from-blue-300 to-purple-200"
                            : "bg-gradient-to-br from-gray-800 to-gray-600"
                        }
                      bg-clip-text text-transparent`}
                      >
                        {headingText}
                        <span className="inline-block w-0.5 h-[1em] ml-1 animate-pulse bg-current" />
                      </h2>

                      {showAnswer && (
                        <p
                          className={`text-xl sm:text-2xl md:text-3xl font-medium ${themeStyles.answer}`}
                        >
                          {answerText}
                        </p>
                      )}

                      {showCTA && (
                        <p
                          className={`text-xl sm:text-2xl md:text-3xl font-medium ${themeStyles.cta}`}
                        >
                          {ctaText}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Icon Section - Middle */}
                <div className="flex-1 flex items-center justify-center px-8">
                  {nextQueued && (
                    <div className="transform transition-all duration-300 ease-in-out hover:scale-110">
                      {headings[headingIndex][3]}
                    </div>
                  )}
                </div>

                {/* Form Section - Bottom */}
                <div className="flex-initial px-8 mb-8">
                  <form
                    onSubmit={handleSubmit}
                    className="flex flex-col sm:flex-row gap-3 w-full"
                  >
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onInput={handleChange}
                      required
                      className={`flex-1 px-4 py-2 text-base sm:text-lg rounded-lg ${themeStyles.input}`}
                    />
                    <button
                      type="submit"
                      className={`px-4 py-2 text-base sm:text-lg font-medium rounded-lg text-white whitespace-nowrap ${themeStyles.button}`}
                    >
                      Join Waitlist
                    </button>
                  </form>
                </div>
              </div>
            )
            : (
              <>
                <div>
                  <h2
                    className={`text-4xl sm:text-5xl font-extrabold mb-4 ${
                      isDark
                        ? "bg-gradient-to-br from-gray-200 to-gray-600"
                        : "bg-gradient-to-br from-gray-800 to-gray-600"
                    } bg-clip-text text-transparent`}
                  >
                    Thank You for Joining!
                  </h2>
                </div>
                <div>
                  <p className="text-lg sm:text-xl mb-8">
                    We'll keep you updated on our progress and let you know when
                    we launch.
                  </p>
                </div>
              </>
            )}
        </div>

        <Footer isDark={isDark} />
        <button
          type="button"
          onClick={toggleTheme}
          className={`fixed bottom-4 right-4 p-3 rounded-full transition-colors 
            shadow-lg hover:scale-110 transform duration-200 z-50
            ${
            isDark ? "bg-gray-800 text-gray-200" : "bg-gray-200 text-gray-800"
          }`}
          aria-label="Toggle theme"
        >
          {isDark ? "☀️" : "🌙"}
        </button>
      </div>
    </div>
  );
}
