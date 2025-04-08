import { render, screen } from '@testing-library/react';

import Sample from '@/components/shared/Sample';

describe('HelloWorld', () => {
  it('renders "Hello, World" text', () => {
    render(<Sample />);
    const heading = screen.getByRole('heading', { name: /hello, world/i });
    expect(heading).toBeInTheDocument();
  });
});
