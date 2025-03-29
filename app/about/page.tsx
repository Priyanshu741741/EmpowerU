import Image from "next/image"
import { PageTransition } from "@/components/page-transition"
import { TeamMember } from "@/components/team-member"
import { Newsletter } from "@/components/newsletter"
import { getTeamMembers } from "@/lib/team"
import Footer from "@/components/footer"

export default async function AboutPage() {
  const teamMembers = await getTeamMembers()

  return (
    <PageTransition>
      <section className="py-16 md:py-24 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">About Our Club</h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400">
              Empowering women through community, education, and advocacy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg mb-4 text-gray-700 dark:text-gray-300">
                We believe in a world where all women have equal opportunities to thrive, lead, and make their voices
                heard.
              </p>
              <p className="text-lg mb-4 text-gray-700 dark:text-gray-300">
                Our club is dedicated to empowering women through education, mentorship, and community support. We
                create spaces where women can share their stories, develop their skills, and build meaningful
                connections.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                Through our blog, events, and initiatives, we aim to inspire and uplift women from all walks of life,
                celebrating their achievements and advocating for gender equality.
              </p>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden">
              <Image
                src="/wec-1.jpg"
                alt="Women at a community event"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div className="order-2 md:order-1 relative h-[400px] rounded-2xl overflow-hidden">
              <Image
                src="/wec-1.jpg"
                alt="Women in a workshop"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
              <p className="text-lg mb-4 text-gray-700 dark:text-gray-300">
                Founded in 2016 by a group of passionate students from PEC Chandigarh who recognized the need for a supportive community, our
                club has grown from a small gathering to a thriving network of diverse individuals.
              </p>
              <p className="text-lg mb-4 text-gray-700 dark:text-gray-300">
                What started as informal general body meetings evolved into structured workshops, mentorship programs, and
                this blog platform where we share stories that inspire and empower.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                Today, we continue to expand our reach and impact, connecting women across different backgrounds,
                professions, and experiences through the power of storytelling and community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Meet Our Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <TeamMember key={member.id} member={member} />
            ))}
          </div>
        </div>
      </section> */}

      <Newsletter />
      <Footer />
    </PageTransition>
  )
}

