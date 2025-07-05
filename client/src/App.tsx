import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Practice from "@/pages/practice";
import Question from "@/pages/question";
import Feedback from "@/pages/feedback";
import CustomCaseStudy from "@/pages/custom-case-study";
import EnhancedCaseStudy from "@/pages/enhanced-case-study";
import Learning from "@/pages/learning";
import Account from "@/pages/account";
import SignIn from "@/pages/signin";
import SignUp from "@/pages/signup";
import NotFound from "@/pages/not-found";

function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/practice" component={Practice} />
        <Route path="/question/:id" component={Question} />
        <Route path="/feedback/:answerId" component={Feedback} />
        <Route path="/custom-case-study" component={CustomCaseStudy} />
        <Route path="/enhanced-case-study" component={EnhancedCaseStudy} />
        <Route path="/learning" component={Learning} />
        <Route path="/account" component={Account} />
        <Route path="/signin" component={SignIn} />
        <Route path="/signup" component={SignUp} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
