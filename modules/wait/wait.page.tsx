import { useEffect, useState } from "preact/hooks";
import { useTypingAnimation } from "@app/hooks/useTypingAnimation.ts";
import { JSX } from "preact/jsx-runtime";
import BoltSvg from "@app/components/icons/bolt.tsx";
import { getIconForHeading } from "@app/components/icons/CategoryIcons.tsx";

export default function Wait() {
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
      getIconForHeading("Harga", isDark),
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
      getIconForHeading("Automasi", isDark),
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
      getIconForHeading("Harga", isDark),
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
      getIconForHeading("Dokumen", isDark),
    ],
    [
      "Kesulitan Bandingkan Harga Supplier?",
      "Price comparison otomatis",
      "Lihat analisis perbandingan",
      getIconForHeading("Compare", isDark),
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
      #faf5ff 0%,    /* Lightest purple */
      #e9d5ff 5%,    /* Light purple */
      #d8b4fe 10%,   /* Medium light purple */
      #c084fc 15%,   /* Purple */
      #a855f7 20%,   /* Medium purple */
      #7e22ce 23%,   /* Dark purple */
      #581c87 30%,   /* Darker purple */
      #000000 65%)` /* Pure black */
      : "#f8fafc", /* Single light gray color */
    cardBg: isDark
      ? "bg-gray-900/90" // Slightly more transparent for better glow effect
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
      <div className="relative z-10 w-full max-w-xl mx-auto p-8 min-h-screen flex flex-col">
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
              <>
                {/* Main Content Area - Update flex structure */}
                <div className="flex flex-col flex-1 min-h-[50vh] justify-between">
                  {/* Content Section */}
                  <div className="flex flex-col gap-y-0">
                    {/* Heading Section */}
                    <div className="flex-initial">
                      <div className="py-2 sm:py-3 md:py-4 lg:py-5 min-h-[100px] sm:min-h-[120px] md:min-h-[140px] lg:min-h-[160px] flex items-center">
                        <h2
                          className={`text-[2.5rem] sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl 
                      font-extrabold
                      leading-[1.2] sm:leading-[1.5] md:leading-[1.6]
                      tracking-tight md:tracking-tighter
                      max-w-[95vw] sm:max-w-[85vw] md:max-w-[80vw] mx-auto
                      ${
                            isDark
                              ? "bg-gradient-to-br from-blue-300 to-purple-200"
                              : "bg-gradient-to-br from-gray-800 to-gray-600"
                          } 
                      bg-clip-text text-transparent transition-opacity duration-500
                      drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]`}
                        >
                          <span className="block py-2">
                            <span className="[text-shadow:_0_0_10px_rgba(255,255,255,0.1)]">
                              {headingText}
                            </span>
                            <span className="inline-block w-0.5 sm:w-1 h-[1em] ml-0.5 sm:ml-1 animate-pulse bg-current" />
                          </span>
                        </h2>
                      </div>
                    </div>

                    {/* Answer Section */}
                    {showAnswer && (
                      <div className="w-full max-w-md mx-auto opacity-0 animate-fade-in">
                        <p
                          className={`text-xl sm:text-3xl md:text-3xl text-left ${themeStyles.answer}`}
                        >
                          {answerText}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Icon Display Section */}
                  <div className="flex-grow flex items-center justify-center min-h-[160px]">
                    {/* Increased height */}
                    {nextQueued && (
                      <div className="flex gap-1 scale-150 animate-fade-in">
                        {/* Increased gap and scale */}
                        {headings[headingIndex][3]}
                      </div>
                    )}
                  </div>

                  {/* Form Section */}
                  <div className="flex-initial mt-auto">
                    <div className="flex flex-col gap-y-6">
                      {/* CTA Section */}
                      {showCTA && (
                        <div className="w-full max-w-md mx-auto opacity-0 animate-fade-in">
                          <p
                            className={`text-xl sm:text-3xl md:text-3xl text-left font-medium ${themeStyles.cta}`}
                          >
                            {ctaText}
                          </p>
                        </div>
                      )}
                      <div className="w-full max-w-md mx-auto">
                        <form onSubmit={handleSubmit} className="space-y-6">
                          <input
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onInput={handleChange}
                            required
                            className={`w-full p-3 backdrop-blur-sm border rounded-lg
                              text-xl sm:text-2xl md:text-3xl
                              focus:outline-none focus:ring-2 focus:ring-blue-500 
                              focus:border-transparent transition-colors
                              ${themeStyles.input}`}
                          />
                          <button
                            type="submit"
                            className={`w-full text-white py-2.5 sm:py-3 px-4 rounded-lg
                              text-xl sm:text-2xl md:text-3xl font-semibold transition-colors
                              ${themeStyles.button}`}
                          >
                            Join Waitlist
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer - Move outside main content area */}
                <div
                  className={`w-full mt-8 flex flex-col items-center space-y-4 ${themeStyles.footer}`}
                >
                  {/* Social Icons */}
                  <div class="flex space-x-6">
                    <a
                      href="https://wa.me/628121619781"
                      target="_blank"
                      rel="noopener noreferrer"
                      class={`transition-colors hover:scale-110 transform duration-200 ${themeStyles.footer}`}
                      aria-label="WhatsApp"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </a>
                    <a
                      href="https://www.linkedin.com/company/fastro"
                      target="_blank"
                      rel="noopener noreferrer"
                      class={`transition-colors hover:scale-110 transform duration-200 ${themeStyles.footer}`}
                      aria-label="LinkedIn"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                    <a
                      href="https://github.com/fastrodev/fastro"
                      target="_blank"
                      rel="noopener noreferrer"
                      class={`transition-colors hover:scale-110 transform duration-200 ${themeStyles.footer}`}
                      aria-label="Fastro"
                    >
                      <BoltSvg width="24" height="24" />
                    </a>
                  </div>
                </div>
              </>
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

        {/* Theme Toggle Button */}
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
