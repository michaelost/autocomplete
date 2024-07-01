import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import Autocomplete from './Autocomplete';
import { SEARCH_CHARACTERS } from './Autocomplete';

const mocks = [
  {
    request: {
      query: SEARCH_CHARACTERS,
      variables: {
        name: 'Rick',
      },
    },
    result: {
      data: {
        characters: {
          results: [
            {
              id: '1',
              name: 'Rick Sanchez',
            },
          ],
        },
      },
    },
  },
];

describe('Autocomplete', () => {
  it('renders input field', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Autocomplete />
      </MockedProvider>
    );
    const inputElement = screen.getByPlaceholderText(/search characters.../i);
    expect(inputElement).toBeInTheDocument();
  });

  it('fetches and displays suggestions', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Autocomplete />
      </MockedProvider>
    );
    const inputElement = screen.getByPlaceholderText(/search characters.../i);

    fireEvent.change(inputElement, { target: { value: 'Rick' } });

    await waitFor(() => {
      const suggestionItem = screen.getByText(/rick sanchez/i);
      expect(suggestionItem).toBeInTheDocument();
    });
  });

  it('fills the input field with the selected suggestion', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Autocomplete />
      </MockedProvider>
    );
    const inputElement = screen.getByPlaceholderText(/search characters.../i);

    fireEvent.change(inputElement, { target: { value: 'Rick' } });

    await waitFor(() => {
      const suggestionItem = screen.getByText(/rick sanchez/i);
      fireEvent.click(suggestionItem);
      expect(inputElement).toHaveValue('Rick Sanchez');
    });
  });
});
