import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Users, Lightbulb, Globe, BookOpen, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";

export default function About() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Learn Lab Solution</h1>
          <p className="text-xl md:text-2xl font-light opacity-90">
            Empowering IT professionals to master their next career milestone
          </p>
        </div>
      </section>

      {/* Company Information */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl text-gray-800 mb-4">Our Story</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-lg text-gray-600 leading-relaxed space-y-4">
                <p>
                  We are working in the IT sector in Bangalore, India. Our objective with this website is to provide learners a chance to upskill themselves through practice and practice, as there is no other alternative to that, with the help of AI generated questions and answers.
                </p>
                <p>
                  This platform is primarily focused on Management related roles, but we will ensure we cover all the possible roles in IT sector so that everyone can get benefitted.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission & Values</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We believe that practice is the foundation of excellence. Through AI-powered learning, we make high-quality interview preparation accessible to everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Target className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl text-purple-800">Practice-Focused</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We believe there's no substitute for practice. Our platform provides unlimited opportunities to sharpen your skills.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Lightbulb className="w-8 h-8 text-orange-600" />
                </div>
                <CardTitle className="text-xl text-orange-800">AI-Powered</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Leveraging cutting-edge AI to generate personalized questions, case studies, and feedback tailored to your needs.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-pink-600" />
                </div>
                <CardTitle className="text-xl text-pink-800">Inclusive</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Starting with management roles but expanding to cover all IT sector positions so everyone can benefit.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">What We Offer</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl text-purple-800">Management Roles Focus</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Product Management</li>
                  <li>• Technical Program Management</li>
                  <li>• Engineering Management</li>
                  <li>• General Management</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Globe className="w-6 h-6 text-orange-600" />
                  </div>
                  <CardTitle className="text-xl text-orange-800">Top Tech Companies</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Microsoft, Google, Amazon</li>
                  <li>• Meta, Apple, Oracle</li>
                  <li>• Cisco, Salesforce, Adobe</li>
                  <li>• NVIDIA, Netflix & more</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                    <Target className="w-6 h-6 text-pink-600" />
                  </div>
                  <CardTitle className="text-xl text-pink-800">AI-Generated Content</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Dynamic case studies</li>
                  <li>• Personalized questions</li>
                  <li>• Instant feedback</li>
                  <li>• Progress tracking</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-yellow-600" />
                  </div>
                  <CardTitle className="text-xl text-yellow-800">Future Expansion</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• All IT sector roles</li>
                  <li>• Technical interviews</li>
                  <li>• Coding challenges</li>
                  <li>• System design</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Ready to Start Your Journey?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of IT professionals who are already practicing and improving their skills with Learn Lab Solution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => setLocation("/practice")}
            >
              Start Practicing
            </Button>
            <Button 
              variant="outline" 
              className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-8 py-3 text-lg font-semibold transition-all duration-300"
              onClick={() => setLocation("/learning")}
            >
              Explore Learning
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}