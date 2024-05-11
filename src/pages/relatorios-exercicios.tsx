import { useEffect, useState } from "react";
import { atualizarUsuario } from "../api/api";
import { Exercise } from "../api/interface";
import { deletarExercicio, getExercicios } from "../api/api-exercicios";
import { FaTrash, FaEdit } from 'react-icons/fa';
import buttonAtualizarDeletar from "../components/button/button-table";


function TableDadosUsuarios() {
  const [exercicios, setExercies] = useState<Exercise[]>([]);
  const [valorAtualInput, setValorAtualInput] = useState("");

  const estiloTh = { className: "border px-4 py-2"};
  const TableHeaderFooter = () => (
    
    <thead>
      <tr>
          <th {...estiloTh}>ID</th>
          <th {...estiloTh}>Grupo do Músculo</th>
          <th {...estiloTh}>Dificuldade</th>
          <th {...estiloTh}>Músculo</th>
          <th {...estiloTh}>Arquivo</th>
          <th {...estiloTh}>Nome</th>
          <th {...estiloTh}>Descrição</th>
          <th {...estiloTh}>Ações</th>
          <th {...estiloTh}>ID</th>
      </tr>
    </thead>
  );
  const valorInput = (e: any) => {
    setValorAtualInput(e.target.value);
    const filteredUsers = exercicios.filter(
      (user) =>
        user.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        user.muscle_group.toLowerCase().includes(e.target.value.toLowerCase())
    );

    setExercies(filteredUsers);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const exerciciesAdmin = await getExercicios();

        setExercies([...exerciciesAdmin]);
      } catch (error) {
        console.error("Erro ao obter usuários:", error);
      }
    };

    fetchData();
  }, []);

  const removeExercicie = async (exercise_id: string) => {
    try {
      await deletarExercicio(exercise_id);
      console.log("Exercício deletado");
      setExercies(exercicios.filter((user) => user.exercise_id !== exercise_id));
    } catch (error) {
      console.error("Erro ao deletar o Exercício:", error);
    }
  };

  const atualizarUser = (exercise_id: string) => {
    atualizarUsuario(exercise_id)
      .then(() => {
        console.log("Usuário atualizado");
        setExercies(exercicios.map((user) => (user.exercise_id === exercise_id ? { ...user, } : user)));
      })
      .catch((error) => console.error("Erro ao atualizar o usuário:", error));
  };

  return (
    <div>
      <div className="m-2 flex justify-between items-stretch">
        <div className="flex items-center">
          <h1>Relatório de Exercícios</h1>
        </div>
        <div>
          <label className="input input-bordered  m-2 flex items-center gap-2">
            <input
              type="text"
              className="grow"
              value={valorAtualInput}
              onChange={valorInput}
              placeholder="Pesquisar"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </label>
        </div>
      </div>
      <div className="overflow-x-auto m-2 mt-4 h-screen">
        <table className="table-auto border-collapse">
        <TableHeaderFooter />
          <tbody>
            {exercicios.map((item, index) => (
              <tr key={index} className="text-center">
                <td {...estiloTh}>{index + 1}</td>
                <td className="border p-2">{item.muscle_group}</td>
                <td className="border p-2">{item.difficulty}</td>
                <td className="border p-2">{item.muscle}</td>
                <td className="border p-2">{item.file}</td>
                <td className="border p-2">{item.name}</td>
                <td className="border p-2">{item.description}</td>
                <td className="border p-2">
                  <button
                    {...buttonAtualizarDeletar}
                    onClick={() => removeExercicie(item.exercise_id ?? '')}
                  >
                      <FaTrash className="w-6 h-4 m-1" />
                  </button>
                  <button
                    {...buttonAtualizarDeletar}
                    onClick={() => atualizarUser(item.exercise_id ?? '')}
                  >
                      <FaEdit className="w-6 h-4 m-1" />
                  </button>
                </td>
                <td {...estiloTh}>{index + 1}</td>
              </tr>
            ))}
          </tbody>
          <TableHeaderFooter />
        </table>
       
      </div>
    </div>
  );
}

export default TableDadosUsuarios;
