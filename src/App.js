import React, { useState } from 'react';
import {DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import './App.css';
import _ from "lodash";
import {v4} from "uuid";


const item = {
  id: v4(),
  name: "Arrumar a casa"
}

const item2 = {
  id: v4(),
  name: "lavar o carro"
}

function App() {
  const [text, setText] = useState("")
  const [state, setState] = useState( {
    "fazer": {
      title: "Fazer",
      items: [item, item2]
    },
    "em-progesso": {
      title: "Em-progresso",
      items: []
    },
    "feito": {
      title: "Feito",
      items: []
    }
  })


  // 'soltar'
  const handleDragEnd = ({destination, source}) => {
    if (!destination) {
      return
    } 

    if (destination.index === source.index && destination.droppableId === source.droppableId) {
      return
    }

    // Cópia antes de remover do State
    const itemCopy = {...state[source.droppableId].items[source.index]}

    setState(prev => {
      prev = {...prev}
      // Remove do array 'anterior'
      prev[source.droppableId].items.splice(source.index, 1)


      // Adicionando no array 'selecionado'
      prev[destination.droppableId].items.splice(destination.index, 0, itemCopy)

      return prev
    })
  }

  const addItem = () => {
    setState(prev => {
      return {
        ...prev,
        fazer: {
          title: "fazer",
          items: [
            {
              id: v4(),
              name: text
            },
            ...prev.fazer.items
          ]
        }
      }
    })

    setText("")
  }



   return (
    <div className="App">
      <div className="bb">
        <input type="text" value={text} onChange={(e) => setText(e.target.value)}/>
        <button onClick={addItem}>Adicionar Item</button>
      </div>
     <DragDropContext onDragEnd={ handleDragEnd}>
      {_.map(state, (data, key) => {
          return(
           <div key={key} className={"Column"}>
             <h3>{data.title}</h3>
             <Droppable droppableId={key}>
              {(provided) =>{
                return(
                  <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={"droppable-col"}
                  >
                    {data.items.map((el, index) =>{
                      return(
                        <Draggable key={el.id} index={index} draggableId={el.id}>
                          {(provided) => {
                            return(
                              <div
                              className={"item"}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              >
                                {el.name}
                              </div>
                            )
                          }}
                        </Draggable>
                      )
                    } )}
                    {provided.placeholder}
                  </div>
                )
              }}
            </Droppable>
           </div>
          )
      })}
     </DragDropContext>
    </div>
  );
}
export default App;
//data seria o objeto como um todo e a Key seria os tres pilares("Fazer", "em-progresso", "feito").
// Elemento ref={x.innerRef} pro React DND saber qual div foi selecionada!
//A utilização do map, de forma resumida, se deve ao fato do map nos retornar algo em específico, já o método forEach não! 
// Sempre que o elemento for puxado/selecionado, seu espaço será assegurado até ele ser alocado em outro "card".