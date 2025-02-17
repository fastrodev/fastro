import { useState } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";

export default function Wait() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const handleChange = (e: JSX.TargetedEvent<HTMLInputElement, InputEvent>) => {
    setEmail((e.target as HTMLInputElement).value);
  };

  return (
    <div className="relative min-h-screen">
      {/* Gradient Background */}
      <div
        className="fixed inset-0"
        style={{
          background: "radial-gradient(circle at center, #1a1a1a, #000000)",
        }}
      />

      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-xl mx-auto p-8 flex flex-col justify-between min-h-screen">
        <div className="flex-1 flex flex-col justify-center items-center text-center">
          {!isSubmitted
            ? (
              <>
                <div>
                  <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-br from-gray-200 to-gray-600">
                    Tired of Inventory Headaches?
                  </h2>
                </div>
                <div>
                  <p className="text-lg sm:text-xl mb-8 text-gray-300">
                    A better solution is on its way! Join the waitlist to be
                    among the first to use our new inventory and purchasing
                    application.
                  </p>
                </div>
                <div className="w-full max-w-md">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={handleChange}
                      required
                      className="w-full p-3 bg-gray-700/30 backdrop-blur-sm border border-gray-600 rounded-lg
                             text-white placeholder-gray-400 
                             focus:outline-none focus:ring-2 focus:ring-blue-500 
                             focus:border-transparent"
                    />
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg
                             text-lg font-semibold
                             hover:bg-blue-700 transition-colors"
                    >
                      Join Waitlist
                    </button>
                  </form>
                </div>
              </>
            )
            : (
              <>
                <div>
                  <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-br from-gray-200 to-gray-600">
                    Thank You for Joining!
                  </h2>
                </div>
                <div>
                  <p className="text-lg sm:text-xl mb-8 text-gray-300">
                    We'll keep you updated on our progress and let you know when
                    we launch.
                  </p>
                </div>
              </>
            )}
        </div>

        {/* Footer Social Links - Optional */}
        <div className="pt-8 flex flex-col items-center space-y-4">
          <div className="flex justify-center space-x-6">
            {/* Add social icons here if needed */}
          </div>
          <p className="text-gray-400 text-sm">
            Powered by{" "}
            <a
              href="https://github.com/fastrodev/fastro"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Fastro Framework
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
