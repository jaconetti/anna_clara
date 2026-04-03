import Hero from "@/components/hero";
import HowItWorks from "@/components/how-it-works";
import BolaoSection from "@/components/bolao-section";
import ItemForm from "@/components/item-form";
import ParticipantsTable from "@/components/participants-table";
import PixCounter from "@/components/pix-counter";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <HowItWorks />
      <BolaoSection />
      <section id="registrar" className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <ItemForm />
      </section>
      <section id="arrecadado" className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <PixCounter />
      </section>
      <section id="participantes" className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <ParticipantsTable />
      </section>
      <footer className="border-t border-gray-200 bg-white bg-opacity-50 backdrop-blur-sm mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-gray-600">
          <p>Obrigado por ser parte deste momento especial! 💕</p>
        </div>
      </footer>
    </main>
  );
}
