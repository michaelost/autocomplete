'use client'
import React from 'react';
import { useState } from 'react';
import { useLazyQuery, gql } from '@apollo/client';

import {
    Box,
    TextField,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    CircularProgress,
    Paper,
    ListItemIcon,
  } from '@mui/material';
  import CheckCircleIcon from '@mui/icons-material/CheckCircle';

  type Character = {
    id: string;
    name: string;
  };

export const SEARCH_CHARACTERS = gql`
  query SearchCharacters($name: String!) {
    characters(filter: { name: $name }) {
      results {
        id
        name
      }
    }
  }
`;

const Autocomplete: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [getSuggestions, { loading, data }] = useLazyQuery(SEARCH_CHARACTERS, {
    fetchPolicy: 'cache-and-network',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.length > 2) {
      getSuggestions({ variables: { name: value } });
    }
  };

  const handleSuggestionClick = (name: string) => {
    setInputValue(name);
  };

  return (
    <Box sx={{ width: 300, margin: '0 auto' }}>
      <TextField
        fullWidth
        label="Search characters"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Search characters..."
        variant="outlined"
        margin="normal"
        inputProps={{ 'aria-label': 'Search characters' }}
      />
      {loading && <CircularProgress />}
      {data && data.characters && (
        <Paper 
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            maxHeight: 200,
            overflowY: 'auto',
            zIndex: 1,
          }}
        >
          <List>
            {data.characters.results.map((character: Character) => (
              <ListItem key={character.id} disablePadding>
                <ListItemButton
                  onClick={() => handleSuggestionClick(character.name)}
                  role="option"
                >
                  <ListItemText primary={character.name} />
                  {inputValue === character.name && (
                    <ListItemIcon>
                      <CheckCircleIcon style={{ color: 'green' }} />
                    </ListItemIcon>
                  )}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default Autocomplete;
