import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { useAuth } from "../../auth/AuthProvider";
import * as XLSX from 'xlsx';
import { Pie } from 'react-chartjs-2';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts';
import { Chart, ArcElement, PieController } from 'chart.js';
import convert from 'color-convert';
import 'react-datepicker/dist/react-datepicker.css';

Chart.register(ArcElement, PieController);

interface Props {
	setOpenForm: (value: boolean) => void
}

export const ReportsForm = ({ setOpenForm }: Props) => {
	const {id} = useParams();
	const auth = useAuth();
	interface ReportCategory {
		category: string;
		total: number;
	}
	interface ReportDay {
		day: string;
		total: number;
	}
	
	const [reportByCategories, setReportByCategories] = useState<ReportCategory[]>([]);
	
	const [reportByTime, setReportByTime] = useState<ReportDay[]>([]);

	const downloadReportByCategories = () =>{
		const worksheet = XLSX.utils.json_to_sheet(reportByCategories);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Categories');
		XLSX.writeFile(workbook, 'categories.xlsx');
	}

	const downloadReportByTime = () =>{
		const worksheet = XLSX.utils.json_to_sheet(reportByTime);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Day');
		XLSX.writeFile(workbook, 'categories.xlsx');
	}

	const Histogram = () => {
		return (
			<div>
				<BarChart
					width={500}
					height={300}
					data={reportByTime}
					margin={{
						top: 5, right: 30, left: 20, bottom: 5,
					}}
				>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="date" />
					<YAxis />
					<Tooltip />
					<Bar dataKey="total" fill="#8884d8" />
				</BarChart>
			</div>
		);
	};

	const PieChart = () => {
		const chartData = {
		  labels: reportByCategories.map(item => item.category),
		  datasets: [{
			data: reportByCategories.map(item => item.total),
			backgroundColor: reportByCategories.map((_, i, arr) => {
				const hue = Math.floor(i / arr.length * 360);
				return `#${(convert.hsl.hex as any)(hue, 35, 60)}`;
			}),
		  }],
		};
	  
		return (
		  <div className="flex flex-col items-center">
			<div className="w-64 h-64 mx-2 mb-2">
			  <Pie data={chartData} />
			</div>
			<div className="overflow-hidden">
				{chartData.labels.map((label, index) => (
				  <div className="flex items-center" key={index}>
				    <div style={{ width: '20px', height: '20px', backgroundColor: chartData.datasets[0].backgroundColor[index], marginRight: '10px' }}></div>
				    <div className="overflow-hidden text-ellipsis max-w-150">{label}</div>
				  </div>
				))}
			</div>
		  </div>
		);
	  };

	function closeForm() {
		setOpenForm(false);
	}

	useEffect(() => {
			if(auth.getToken()) {
				fetch(`https://magicsplitapi-production.up.railway.app/api/group/${id}/report/category`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${auth.getToken()}`,
					}
				})
				.then(response => response.json())
				.then(data => {
					setReportByCategories(data.report.sort((a: ReportCategory, b: ReportCategory) => b.total - a.total))
				})
				.catch(error => console.error('Error fetching data:', error));
			};
			if (auth.getToken()) {
				fetch(`https://magicsplitapi-production.up.railway.app/api/group/${id}/report/time`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${auth.getToken()}`,
					},
				})
					.then(response => response.json())
					.then(data => {
						setReportByTime(data.report)
					})
					.catch(error => console.error('Error fetching data:', error));
			}
		}, [auth, id]);

	const [selectedOption, setSelectedOption] = useState('Categoría');

	return (
		<div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
			<div className="fixed inset-0 bg-gray-500 bg-opacity-50 transition-opacity"></div>
			<div className="fixed inset-0 z-10 w-screen overflow-y-auto">
				<div className="flex min-h-full items-center justify-center p-4 text-center  sm:p-0">
				<div className="bg-white shadow-md rounded-lg p-6 w-auto">
					<div className="mb-4">
						<label className="text-center block text-slate-900 text-2xl font-bold mb-2" htmlFor="description">
							Estadísticas
						</label>
					</div>

					<div className="flex justify-center">
						<button className={`bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-l-md ${selectedOption === 'Categoría' ? 'bg-slate-700' : 'bg-slate-500'}`} onClick={() => setSelectedOption('Categoría')}>Por Categoría</button>
						<button className={`bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-r-md ${selectedOption === 'Tiempo' ? 'bg-slate-700' : 'bg-slate-500'}`} onClick={() => setSelectedOption('Tiempo')}>Por Tiempo</button>
					</div>

					{selectedOption === 'Tiempo' && <div className="my-3">
						{false &&
						<div className="w-full flex justify-center mb-5">
						  <div className="w-auto flex justify-between">
						    <div className="flex items-center w-auto  mr-2">
						      <label className="mr-2 text-sm font-bold" htmlFor="from">
						        Desde
						      </label>
						      <input className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:shadow-outline" id="from" type="date" />
						    </div>
						    <div className="flex items-center w-auto mr-2">
						      <label className="mr-2 text-sm font-bold" htmlFor="to">
						        Hasta
						      </label>
						      <input className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:shadow-outline" id="to" type="date" />
						    </div>
							<div className="flex items-center w-auto">
							<button className="bg-slate-700 hover:bg-slate-600 text-slate-100 text-center font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
							Ir
							</button> 
						    </div>
						  </div>
						</div>
						}

						<div className='w-full flex flex-row justify-center'>			
							{/* First container with table*/}
							<div className="w-auto flex flex-col items-center">
								<table className=" text-md text-left bg-white border border-slate-200">
									<tbody>
										<tr className="border-b bg-slate-200">
								          <th className="p-3 px-5 border-r">Día</th>
								          <th className="p-3 px-5">Total gastado</th>
								        </tr>
										{reportByTime.map((item, index) => (
								    	  <tr key={index} className="border-b">
								    	    <td className="p-3 px-5 border-r">{item.day}</td>
								    	    <td className="p-3 px-5">$ {item.total}</td>
								    	  </tr>
								    	))}
										<tr className="border-t">
								        	<td className="p-3 px-5 border-r font-bold">Total</td>
								        	<td className="p-3 px-5 font-bold">$ {reportByTime.reduce((sum, item) => sum + item.total, 0)}</td>
								    	</tr>
									</tbody>
								</table>
								<button className="text-slate-100 bg-slate-700 justify-self-center px-4 p-2 rounded-md my-3" onClick={downloadReportByTime}>Descargar reporte</button>
							</div>
							{/* Second container with pie chart  */}
							{reportByTime.length > 0 &&
							<div className=" w-auto flex flex-col">
								<Histogram/>
							</div>
							}
						</div>
					</div>}

					{selectedOption === 'Categoría' && <div className="my-3">
						<div className='w-full flex flex-row justify-center'>
							{/* First container with table*/}
							<div className="w-auto flex flex-col items-center">
								<table className=" text-md text-left bg-white border border-slate-200">
									<tbody>
										<tr className="border-b bg-slate-200">
								          <th className="p-3 px-5 border-r">Categoría</th>
								          <th className="p-3 px-5">Total gastado</th>
								        </tr>
										{reportByCategories.map((item, index) => (
								    	  <tr key={index} className="border-b">
								    	    <td className="p-3 px-5 border-r">{item.category}</td>
								    	    <td className="p-3 px-5">$ {item.total}</td>
								    	  </tr>
								    	))}
										<tr className="border-t">
								        	<td className="p-3 px-5 border-r font-bold">Total</td>
								        	<td className="p-3 px-5 font-bold">$ {reportByCategories.reduce((sum, item) => sum + item.total, 0)}</td>
								    	</tr>
									</tbody>
								</table>
								<button className="text-slate-100 bg-slate-700 justify-self-center px-4 p-2 rounded-md my-3" onClick={downloadReportByCategories}>Descargar reporte</button>
							</div>
							{/* Second container with pie chart  */}
							{reportByCategories.length > 0 && 
							<div className="flex flex-col w-auto">
								<div className="m-3 mt-0">
									<PieChart/>
								</div>
							</div>
							}
						</div>
					</div>}

					<div className="flex items-center justify-end">
					<button onClick={closeForm} className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-center font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
						Cerrar
					</button> 
					</div>
				</div>
				</div>
			</div>
		</div>
	)
}
