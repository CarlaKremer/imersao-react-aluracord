import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from "next/router";
import { ButtonSendSticker } from '../src/components/ButtonSendSticker';

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzMzNzQ4NCwiZXhwIjoxOTU4OTEzNDg0fQ.mUXY9O6qGdtdpKFpKGL389hn8G7329641lYztxa9Euw';
const SUPABASE_URL = 'https://mqygebbwfmppdjdncxgr.supabase.co';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

function escutaMensagemEmTempoReal(adicionaMensagem){
    return supabaseClient
        .from('mensagens')
        .on('INSERT', (respostaLive)=>{
            adicionaMensagem(respostaLive.new);
        })
        .subscribe();
}


export default function ChatPage() {
    //acessar usuario que logou pela url:
    const roteamento = useRouter();
    const usuarioLogado = roteamento.query.username;

    const [mensagem, setMensagem] = React.useState();
    const [listaDeMensagens, setListaDeMensagens] = React.useState([
        // {
        //     id: 1,
        //     de: 'carlakremer',
        //     texto: ':sticker: https://www.alura.com.br/imersao-react-4/assets/figurinhas/Figurinha_3.png',
        // }
    ]);
    
    React.useEffect(()=>{
        supabaseClient
            .from('mensagens')
            .select('*')
            .order('id', {ascending:false})
            .then(({data}) =>{
                console.log("Dados do Supabase: ", data);
                setListaDeMensagens(data);
            });

        escutaMensagemEmTempoReal((novaMensagem)=>{
            console.log('Nova Mensagem', novaMensagem);
            console.log('Lista de mensagens:', listaDeMensagens);
           setListaDeMensagens((valorAtualdaLista)=>{
               return[
                    novaMensagem,
                    ...valorAtualdaLista,
                ]
           }
        )});
    },[]);
    //useEffect: para coisas que não fazem parte do fluxo padrão, por padrão roda sempre que a página carrega
    
    /*
    // Usuário
    - digita a mensagem no campo
    - enter envia
    - adiciona o texto na listagem

    //Dev
    - criar o campo
    - usar onChange para e useState para limpar a variavel
    - listar mensagens
    */
    function handleNovaMensagem(novaMensagem) {
        const mensagem = {
            de: usuarioLogado,
            texto: novaMensagem
        };

        supabaseClient
            .from('mensagens')
            .insert([
                mensagem
            ])
            .then(({data})=>{
                console.log('criando nova msg:',data)
            })

        setMensagem('');
    }
    return (
        <Box
            // Fundo
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary[500],
                backgroundImage: `url(https://preview.redd.it/g13rkq5m66c81.jpg?width=4096&format=pjpg&auto=webp&s=b9f74e6ab42a832daf4b5d2e40eec361e01ce267)`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                // caixa de fora 
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',

                }}
            >
                <Header /* "chat" e logout*/ />
                <Box
                    // caixa de dentro
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >
                    {/* // teste
                    Ta mudando o valor: {mensagem} */}
                    {/* lista:{listaDeMensagens.map((mensagemAtual)=>{
                        return( 
                            <li key={mensagemAtual.id}>
                                    {mensagemAtual.de}: {mensagemAtual.texto}
                            </li>
                        )
                    })} */}
                    {/* <MessageList mensagens={[]} /> */}
                    <MessageList mensagens={listaDeMensagens} />
                    <Box
                        //caixa do campo de mensagem
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            //input
                            value={mensagem}
                            onChange={
                                (event) => { //arrow function
                                    const valor = event.target.value;
                                    setMensagem(valor);
                                }
                            }

                            onKeyPress={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    handleNovaMensagem(mensagem);
                                }
                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                        <ButtonSendSticker
                            onStickerClick={(sticker)=>{
                                console.log('Salva esse sticker no banco',sticker);
                                handleNovaMensagem(':sticker: '+ sticker);
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {
    // console.log(props);
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'scroll',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
            {props.mensagens.map((mensagem) => {
                return (
                    <Text
                        key={mensagem.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                }}
                                src={`https://github.com/${mensagem.de}.png`}
                            />
                            <Text tag="strong">
                                {mensagem.de}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: '10px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {(new Date().toLocaleDateString())}
                            </Text>
                        </Box>
                        {mensagem.texto.startsWith(':sticker:')
                            //if else (ternário)
                            ?(<Image src={mensagem.texto.replace(':sticker:','')}/>):(mensagem.texto) 
                        }
                    </Text>
                )
            })}

        </Box>
    )
}