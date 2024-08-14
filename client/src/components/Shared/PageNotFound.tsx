import Container from "./Container";

export default function PageNotFound() {
  return (
    <Container>
      <div className="flex flex-col items-center text-red-700">
        <h1>404</h1>
        <p>Page not found</p>
      </div>
    </Container>
  );
}
