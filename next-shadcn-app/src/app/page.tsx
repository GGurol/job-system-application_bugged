import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

const HomePage = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card>
        <Card.Header>
          <Card.Title>Welcome to Next.js with shadcn/ui</Card.Title>
          <Card.Description>
            This is a sample application demonstrating the integration of shadcn/ui with Next.js and TypeScript.
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <Button variant="primary">Get Started</Button>
        </Card.Content>
      </Card>
    </main>
  );
};

export default HomePage;