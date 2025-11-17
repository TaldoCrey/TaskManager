# Desafio Técnico CatiJR

# Informações do Projeto:
* ## FrontEnd - React com TypeScript pelo VITE.
    * Para estilização foi usado o tailwind assim como solicitado.
    * Todos os componentes usados em App.tsx estão em /frontend-react/src/Components
    * Arquivos .css foram utilizados para não prejudicar visualização dos estilos (quando a string do tailwind ficava muito extensa).
    * O design de frames e dos componentes foi feito seguindo ao máximo a referência do figma.
* ## BackEnd - Java Spring-Boot pelo Maven.
    * O banco de dados utilizado para armazenar as informações foi o PostGres, assim como solicitado.
    * Todos os EndPoints da API estão localizados em seus respectivos arquivos controladores (**TaskListController.java** ou **TaskController.java**)
    * O classe que representa as listas se chama TaskList pois estava dando conflito com a List do java.utils.
    * Todos os testes unitários estão no caminho /backend-java/src/test/java/com.catijr.backend_java/service
    

## EndPoints da API
| Método | Endpoint | Descrição |
| :---      | :---     | :---      |
| `POST`     | `/v1/lists` | Cria uma nova lista
| `GET`     | `/v1/lists` | Retorna todas as listas
| `GET`     | `/v1/lists/{listId}` | Retorna as informações da lista dona de `listId`
| `PUT`     | `/v1/lists/{listId}` | Atualiza as informações da lista dona de `listId`
| `DELETE`     | `/v1/lists/{listId}` | Deleta a lista dona de `listId`
| `POST`     | `/v1/tasks` | Cria uma nova task
| `GET`     | `/v1/tasks/{taskId}` | Retorna as informações da task dona de `taskId`
| `PUT`     | `/v1/tasks/{taskId}` | Atualiza as informações da task dona de `taskId`
| `DELETE`     | `/v1/tasks/{taskId}` | Deleta as informações da task dona de `taskId`

## Ressalvas
1. Infelizmente, não tive tempo de tentar o upload de arquivos de imagem para serem armazenados junto das tasks.
2. Também não fui capaz de dar deploy, já que tive muitos problemas com o Render e o Fastcron.

# Como iniciar a aplicação
## Requisitos
Sem os seguintes requisitos, a chance da aplicação não falhar e não iniciar é alta:
* *nodejs: v25.1.0*
* *vite: v7.2.2*
* *java: v21*
* *spring-boot: v3.5.7*
* *maven: v3.8.7*

Dito isso, caso os requisitos sejam iguais ou superiores, siga as instruções abaixo.

## Instruções
Na raiz do projeto (fora de /frontend-react/ e de /backend-java/) rode os arquivos: `runbackend.sh` e `runfrontend.sh` **em terminais SEPARADOS**. Depois disso, quando ambos terminais estagnarem (nenhuma nova log aparecer na tela) abra o navegador pelo seu PC (ou celular), usando o endereço:
* http://0.0.0.0:5173 (acesso para dispositivos fora o que está rodando)
* http://localhost:5173 (acesso em loopback para o dispositivo que está rodando)

# Algumas observações de uso
## FrontEnd
* Para agarrar uma task você deve clicar em cima da mesma e esperar menos de um segundo (segurando o clique) para que ela se torne agarrável (o cursor do mouse vai mudar quando for possível arrastá-la pela tela).
* Para abrir o menu de [**Editar**, **Duplicar** e **Deletar**] de uma task ou o menu de [**Renomear**, **Deletar**] de uma lista, deve ser pressionado o botão direito do mouse.
## Uso no geral
* Nenhum formulário será enviado totalmente vazio (com exceção dos formulários de edição).
    * Contudo, mesmo podendo serem enviados sem que o usuário faça nenhuma alteração, campos como nome da task e nome da lista não podem estar vazios ("") 
* Ao deletar uma lista, eu optei por deletar a lista e todas suas tarefas caso o usuário confirme a deleção, em cascata total.




