export const metadata = { title: "About & privacy" };

export default function About() {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-extrabold">About Skul SL</h1>
      <p>Skul SL is a free study app for students in Sierra Leone, from Primary school to university. It works with little or no internet.</p>
      <h2 className="text-lg font-bold">Your privacy</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li>No account and no sign-up. Your progress, notes and flashcards stay on your own phone.</li>
        <li>If you use the AI tutor, your question is sent to a free AI service to get an answer. Do not type your full name, phone number or other private details.</li>
        <li>The Explore page asks Wikipedia, a free dictionary and Project Gutenberg for results.</li>
      </ul>
      <h2 className="text-lg font-bold">About the content</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li>Short revision lessons and quiz questions are original. Longer lessons are adapted from free OpenStax textbooks (see Credits and licences); those stay non-commercial and carry the original licence.</li><li>The “Global notes” are shortened Wikipedia articles for a worldwide audience. They go beyond the syllabus and can contain mistakes.</li><li>None of it is real exam papers or an official syllabus.</li>
        <li>Always follow your teacher, school and the examination body for official requirements.</li>
        <li>Grade calculators are guides. Universities set their own rules.</li>
        <li>Found a mistake? Tell your teacher or the app owner so it can be fixed.</li>
      </ul>
    </div>
  );
}
