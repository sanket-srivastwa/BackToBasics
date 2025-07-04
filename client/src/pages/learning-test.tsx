import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ArrowLeft, Code, TrendingUp, Users } from "lucide-react";

export default function LearningTest() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button 
          variant="ghost" 
          onClick={() => setLocation("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4">
            Learning Materials Test
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Testing if learning materials load correctly
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <Code className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Technical Program Management</CardTitle>
              <CardDescription className="text-gray-600">
                Master complex technical programs and lead engineering teams to success
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm text-gray-500 mb-4">
                <span>36 lessons</span>
                <span>12.5k students</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Product Management</CardTitle>
              <CardDescription className="text-gray-600">
                Build products that customers love and drive business growth
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm text-gray-500 mb-4">
                <span>42 lessons</span>
                <span>25k students</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Engineering Management</CardTitle>
              <CardDescription className="text-gray-600">
                Lead engineering teams and drive technical excellence
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm text-gray-500 mb-4">
                <span>28 lessons</span>
                <span>8.3k students</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}