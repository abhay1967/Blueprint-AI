
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  GithubAuthProvider, 
  onAuthStateChanged 
} from "firebase/auth";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Github, Mail } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        navigate('/app');
      }
    });
    return unsubscribe;
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
          variant: "default"
        });
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        toast({
          title: "Account created successfully!",
          description: "Your account was created successfully.",
          variant: "default"
        });
      }
      // Redirect handled by onAuthStateChanged
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleSocialAuth = async (provider: string) => {
    try {
      let providerObj;
      if (provider === "Google") {
        providerObj = new GoogleAuthProvider();
      } else if (provider === "GitHub") {
        providerObj = new GithubAuthProvider();
      } else {
        throw new Error("Unsupported provider");
      }
      await signInWithPopup(auth, providerObj);
      toast({
        title: `Signed in with ${provider}!`,
        description: `Authentication with ${provider} successful.`,
        variant: "default"
      });
      // Redirect handled by onAuthStateChanged
    } catch (error: any) {
      toast({
        title: `Authentication Error`,
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-black dark:bg-white p-3 rounded-xl">
              <Building className="w-8 h-8 text-white dark:text-black" />
            </div>
          </div>
          <h1 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">
            Blueprint AI
          </h1>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {isLogin ? "Welcome Back" : "Create Account"}
            </CardTitle>
            <CardDescription>
              {isLogin 
                ? "Sign in to continue building with Blueprint AI" 
                : "Join Blueprint AI to start creating system architectures"
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12"
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12"
                required
              />
              <Button 
                type="submit" 
                className="w-full h-12 bg-black hover:bg-gray-800 text-white rounded-xl"
              >
                {isLogin ? "Continue" : "Create Account"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                onClick={() => handleSocialAuth("Google")}
                className="h-12"
              >
                <Mail className="w-4 h-4 mr-2" />
                Google
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleSocialAuth("GitHub")}
                className="h-12"
              >
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"
                }
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Auth;
