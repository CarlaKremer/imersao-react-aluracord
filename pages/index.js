import appConfig from "../config.json"
import { Box, Button, Text, TextField, Image  } from '@skynexui/components';
import React from "react";
import {useRouter} from "next/router";

  
  function Titulo(props) {
    const Tag = props.tag || 'h1';
    return (
      <>
        <Tag>{props.children}</Tag>
        <style jsx>{`
              ${Tag} {
                  color: ${appConfig.theme.colors.neutrals['000']};
                  font-size: 24px;
                  font-weight: 600;
              }
              `}</style>
      </>
    );
  }
  
  export default function PaginaInicial() {
    const [username, setUsername ]= React.useState('');
    // valor que definiu e funcção que muda o valor
    const roteamento = useRouter();

    return (
      <>
        
        {/* Background */}
        <Box 
          styleSheet={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: appConfig.theme.colors.primary[100],
            backgroundImage: 'url(https://preview.redd.it/g13rkq5m66c81.jpg?width=4096&format=pjpg&auto=webp&s=b9f74e6ab42a832daf4b5d2e40eec361e01ce267)',
            backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
          }}
        >
          <Box
            styleSheet={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: {
                xs: 'column',
                sm: 'row',
              },
              width: '100%', maxWidth: '700px',
              borderRadius: '5px', padding: '32px', margin: '16px',
              boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
              backgroundColor: appConfig.theme.colors.neutrals[600],
            }}
          >
            {/* Formulário */}
            <Box
              as="form"
              onSubmit={
                function(infosDoEvento){
                  infosDoEvento.preventDefault();
                  console.log("submeteu")
                  // window.location.href="/chat"
                  roteamento.push("/chat");
                }

              }
              styleSheet={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                width: { xs: '100%', sm: '50%' }, textAlign: 'center', marginBottom: '32px',
              }}
            >
              <Titulo tag="h2">Boas vindas de volta!</Titulo>
              <Text variant="body3" styleSheet={{ marginBottom: '32px', color: appConfig.theme.colors.neutrals[100] }}>
                {appConfig.name}
              </Text>
  
              <TextField
                value={username} 
                onChange={
                    function(event)
                    { 
                      //Onde ta o valor?:
                      console.log("usuario digitou", event.target.value)
                      //troca o valor da variavel
                      const valor = event.target.value;
                      //avisa a função que deve ser trocado
                      setUsername(valor);
                    }
                  }
                fullWidth
                textFieldColors={{
                  neutral: {
                    textColor: appConfig.theme.colors.neutrals[200],
                    mainColor: appConfig.theme.colors.neutrals[950],
                    mainColorHighlight: appConfig.theme.colors.primary[500],
                    backgroundColor: appConfig.theme.colors.neutrals[600],
                  },
                }}
              />
              <Button
                type='submit'
                label='Entrar'
                fullWidth
                buttonColors={{
                  contrastColor: appConfig.theme.colors.neutrals["000"],
                  mainColor: appConfig.theme.colors.primary[500],
                  mainColorLight: appConfig.theme.colors.primary[400],
                  mainColorStrong: appConfig.theme.colors.primary[600],
                }}
              />
            </Box>
            {/* Formulário */}
  
  
            {/* Photo Area */}
            <Box
              styleSheet={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                maxWidth: '200px',
                padding: '16px',
                backgroundColor: appConfig.theme.colors.neutrals[700],
                border: '1px solid',
                borderColor: appConfig.theme.colors.neutrals[999],
                borderRadius: '10px',
                flex: 1,
                minHeight: '240px',
              }}
            >
              <Image
                styleSheet={{
                  borderRadius: '50%',
                  marginBottom: '16px',
                }}
                src={`https://github.com/${username}.png`}
              />
              <Text
                variant="body4"
                styleSheet={{
                  color: appConfig.theme.colors.neutrals[200],
                  backgroundColor: appConfig.theme.colors.neutrals[900],
                  padding: '3px 10px',
                  borderRadius: '1000px'
                }}
              >
                {username}
              </Text>
            </Box>
            {/* Photo Area */}
          </Box>
        </Box>
      </>
    );
  }

  