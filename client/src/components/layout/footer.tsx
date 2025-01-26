export default function Footer() {
  return (
    <footer className="border-t py-8">
      <div className="container mx-auto px-4">
        <div className="text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} TinaSite. Built with Tina CMS.</p>
        </div>
      </div>
    </footer>
  );
}
