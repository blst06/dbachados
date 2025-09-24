import { Typography, useTheme } from '@mui/material';
import React from 'react';
import { useContextTable } from '../../context/TableContext';

interface HighlightedTextProps {
  text: string;
}

const HighlightedText: React.FC<HighlightedTextProps> = ({ text }) => {
  const theme = useTheme();
  const { arrayKeyWord } = useContextTable();
  
   // Prepara as palavras-chave com cores adaptáveis
  const keywords = arrayKeyWord.map(item => {
    const isDarkMode = theme.palette.mode === 'dark';
    
    // Define cores baseadas no tipo e no tema
    let textColor, bgColor;
    
    if (item.type === 'problema') {
      textColor = isDarkMode ? theme.palette.error.light : theme.palette.error.dark;
      
      
    } else { // objeto
      textColor = isDarkMode ? theme.palette.primary.light : theme.palette.primary.dark;
      
    }

    return {
      ...item,
      words: item.label.toLowerCase().split(' '),
      original: item.label,
      length: item.label.length,
      style: {
        color: textColor,
        backgroundColor: bgColor,
        fontWeight: 'bold',
        padding: '0 2px',
        borderRadius: '2px'
      }
    };
  });

  // Ordena por: 1) palavras com mais termos, 2) termos mais longos
  keywords.sort((a, b) => {
    if (b.words.length !== a.words.length) {
      return b.words.length - a.words.length;
    }
    return b.length - a.length;
  });

  // Divide o texto em tokens (palavras e espaços)
  const tokens = text.split(/(\s+)/);

  const checkExactMatch = (token: string, keywordWord: string) => {
    return token.toLowerCase() === keywordWord.toLowerCase();
  };

  const checkForKeyword = (startIndex: number) => {
    const remainingTokens = tokens.length - startIndex;

    for (const keyword of keywords) {
      if (keyword.words.length * 2 - 1 > remainingTokens) continue;

      let match = true;
      for (let i = 0; i < keyword.words.length; i++) {
        const tokenIndex = startIndex + i * 2;
        if (!checkExactMatch(tokens[tokenIndex], keyword.words[i])) {
          match = false;
          break;
        }
      }

      if (match) {
        return {
          keyword,
          length: keyword.words.length * 2 - 1
        };
      }
    }

    return null;
  };

  const elements = [];
  let i = 0;

  while (i < tokens.length) {
    const result = checkForKeyword(i);

    if (result) {
      elements.push(
        <span
          key={i}
          style={result.keyword.style}
        >
          {tokens.slice(i, i + result.length).join('')}
        </span>
      );
      i += result.length;
    } else {
      elements.push(
        <span key={i}>
          {tokens[i]}
        </span>
      );
      i++;
    }
  }

  return (
    <Typography component="span">
      {elements}
    </Typography>
  );
};

export default HighlightedText;