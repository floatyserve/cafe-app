import LoginHeader from '../components/auth/LoginHeader';
import LoginForm from '../components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-cafe-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <LoginHeader />
        <LoginForm />
      </div>
    </div>
  );
}
