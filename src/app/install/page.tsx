import SaveOffline from "@/components/SaveOffline";

export const metadata = { title: "Install & use offline" };

export default function Install() {
  return (
    <div>
      <h1 className="text-2xl font-extrabold">Install & use offline</h1>
      <ol className="card mt-4 list-decimal space-y-2 p-4 pl-8">
        <li><strong>Android (Chrome):</strong> tap the ⋮ menu → <em>Install app</em> or <em>Add to Home screen</em>.</li>
        <li><strong>iPhone (Safari):</strong> tap Share → <em>Add to Home Screen</em>.</li>
        <li><strong>Computer:</strong> click the install icon in the address bar.</li>
      </ol>
      <h2 className="mt-6 mb-2 text-lg font-bold">Save all lessons while you have data or Wi-Fi</h2>
      <p className="text-muted">One tap downloads every lesson and quiz page to this phone so you can study with no internet. This uses a little data once.</p>
      <SaveOffline />
      <p className="mt-6 text-sm text-muted">Your progress, notes and flashcards are stored on this phone only. The Explore page and the AI tutor need internet; the AI tutor falls back to searching saved lessons when you are offline.</p>
    </div>
  );
}
