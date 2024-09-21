import { useContext, useState, useEffect } from 'react'
import { TasksContext } from "../../App";
import todayIcon from '../../assets/icons/calendar_today.svg'
import sevenDayIcon from '../../assets/icons/date_range.svg'
import listIcon from '../../assets/icons/list.svg'
import doneIcon from '../../assets/icons/done_all.svg'
import editIcon from '../../assets/icons/edit.svg'
import './Aside.scss';

function Aside() {
    const {
        allTasks, setFilteredTasks, filterType, setFilterType, setDefaultView, lists,  selectedListId, setSelectedListId, listTasks } = useContext(TasksContext);
    const [showList, setShowList] = useState(true)

    const filterTasks = (allTasks, filterType, selectedListId) => {
        const today = new Date();
        const next7Days = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

        console.log(selectedListId)
        const filteredByList = selectedListId ?
            allTasks.filter(
                task => listTasks.some(
                    listTask => listTask.task_id === task.task_id && listTask.list_id === selectedListId))
            : allTasks;

        switch (filterType) {
            case "Today":
                setDefaultView("day")
                return filteredByList.filter((task) => new Date(task.start_date_and_time).toDateString() === today.toDateString() && task.status !== "Complete")
            case "Next7Days":
                setDefaultView("week")
                return filteredByList.filter((task) => new Date(task.start_date_and_time) <= next7Days && new Date(task.start_date_and_time) > today && task.status !== "Complete");
            case "Complete":
                return filteredByList.filter(task => task.status === "Complete")
            default:
                return filteredByList.filter(task => task.status !== "Complete");
        }
    }

    const toggleList = () => {
        setShowList(!showList);
    }

    useEffect(() => {
        console.log('selected List Id', selectedListId)
        setFilteredTasks(filterTasks(allTasks, filterType, selectedListId));
    }, [filterType, allTasks, selectedListId])

    return (
        <aside className='w-full h-auto p-4 flex flex-row place-content-center sticky top-full justify-center gap-2 tablet:sticky tablet:top-0 tablet:flex-col tablet:min-w-44 tablet:w-72 tablet:items-start'>
            <section className='flex flex-row w-1/2 tablet:flex-col tablet:mb-3 tablet:w-full tablet:border-solid tablet:border-b-2 tablet:border-border-grey'>
                <button className='flex custom-aside__button tablet:my-4' onClick={() => setFilterType("Today")}>
                    <img src={todayIcon} alt="calendar icon for today" className='icon' />
                    <span className='hidden tablet:block'>Today</span>
                </button>
                <button className='flex items-center custom-aside__button  tablet:my-4' onClick={() => setFilterType("Next7Days")}>
                    <img src={sevenDayIcon} alt="calendar icon for date range of 7 days" className='icon' />
                    <span className='hidden tablet:block'>Next 7 days</span>
                </button>
            </section>
            <section className='w-1/2 flex flex-row justify-center gap-6 tablet:flex-col tablet:w-full'>
                <button className='w-full flex items-center custom-aside__button' onClick={toggleList}>
                    <img src={listIcon} alt="list icon" className='icon' />
                    <span className='hidden tablet:block  '>Lists</span>
                </button>
                <form>
                    <ul className={`relative ${showList ? "hidden" : "flex flex-col"}`}>
                        <div className='absolute w-full h-full top-10 right-10 tablet:static'>
                            {lists.map((listItem) => {
                                return (
                                    <li
                                        className='tablet:my-1.5 tablet:ml-4 flex items-center custom-aside__button cursor-pointer'
                                        key={listItem.id} value={listItem.id}
                                        onClick={() => {
                                            setSelectedListId(listItem.id)
                                            setFilterType(`List`)
                                        }}
                                    >
                                        <input type="checkbox" className='border-solid border-2 border-border-grey rounded mx-2'></input>
                                        {listItem.list_name}
                                    </li>
                                )
                            })}
                        </div>

                    </ul>
                </form>
                <button className=' flex bg-green-400 items-center custom-aside__button tablet:my-5 tablet: w-full' onClick={() => setFilterType("Complete")}>
                    <img src={doneIcon} alt="done icon" className='icon' />
                    <span className='hidden tablet:block'>Completed</span>
                </button>
                <button className='flex bg-teal-100 tablet:my-4 custom-aside__button '>
                    <img src={editIcon} alt="done icon" className='icon' />
                    <span className='hidden tablet:block'>Personalize</span>
                </button>
            </section>
        </aside>
    )
}

export default Aside
