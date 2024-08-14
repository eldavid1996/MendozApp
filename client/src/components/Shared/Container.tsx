import { ReactNode } from "react";
import styled from "styled-components";

export default function Container({ children }: { children: ReactNode }) {
  return (
    <ContainerOutside>
      <ContainerInside> {children}</ContainerInside>
    </ContainerOutside>
  );
}

export const ContainerOutside = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ContainerInside = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 0 0 50px 50px;
  max-width: 400px;
  width: 100%;
`;

export const ContainerInsideNavBar = styled.div`
  background: #fff;
  padding: 1.5rem;
  border-radius: 50px 50px 0 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
`;

export const ContainerInsideChat = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 650px;
  width: 100%;
  max-height: 625px;
  height: 100rem;
  padding: 1.5rem;
  border-radius: 50px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background: #fff;
`;

export const FormField = styled.div`
  margin-bottom: 1rem;
`;
