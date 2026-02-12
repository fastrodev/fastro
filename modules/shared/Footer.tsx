export default function Footer() {
  return (
    <footer className="mt-6 border-t border-gray-100 dark:border-gray-800 text-sm text-gray-500 dark:text-gray-400 w-full transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
        © {new Date().getFullYear()} Fastro Development
      </div>
    </footer>
  );
}
