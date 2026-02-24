import React, { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../../ui/_button';
import { useParams } from 'react-router-dom';
import TaskService from '../../../../services/auth/TaskService';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../ui/_tooltip';

type GridType = 'daily' | 'weekly' | 'monthly';

interface TaskGridProps {
  startDate: Date;
  endDate: Date;
  gridType?: GridType;
  onDateSelect?: (date: Date, selected: boolean) => void;
  selectedDates?: Set<string>;
  disabledDates?: Set<string>;
}

interface MonthData {
  month: number;
  year: number;
  days: DayData[];
}

interface DayData {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isWeekend: boolean;
  dateString: string;
}

export function TaskGrid() {
  const taskService = new TaskService();
  const {taskId,gridType}: any = useParams();
  const [viewMonth, setViewMonth] = useState(new Date());
  const [startDate,setStartDate] = useState('');
  const[endDate,setEndDate] = useState('');
  const[activeDates,setActiveDates] = useState<string[]>([]);
  const[taskGridData,setTaskGrid] = useState<any>({});

  useEffect(()=>{
    if(taskId !== null || taskId !== undefined)
    getTaskGrid(taskId);
  },[taskId]);

  const getTaskGrid = async (taskId:any)=>{
    const taskGrid = await taskService.getTaskGridByTaskId(localStorage.getItem("token"),taskId);
    if(taskGrid.success && taskGrid?.taskGrids && Object.keys(taskGrid?.taskGrids)?.length > 0)
    {
      setStartDate(taskGrid?.startDate);
      setEndDate(taskGrid?.endDate);
      for(let k in taskGrid?.taskGrids)
      {
        for(var x in taskGrid?.taskGrids[k])
          {
          let metaDataArray:any = [];
          taskGrid?.taskGrids[k][x].forEach((e:any)=>{
            metaDataArray.push(e?.children[0]?.metadata)
          })
          if(taskGrid?.taskGrids[k] && taskGrid?.taskGrids[k][x])
          {
            taskGrid.taskGrids[k][x] = metaDataArray;
          }
        };
        setActiveDates((e)=> [...e,k]);
      }
      console.log(taskGrid);
      setTaskGrid(taskGrid?.taskGrids);
    }
  }

  // const 

  const dateRangeData = useMemo(() => {
    if (gridType !== 'daily') return [];

    const months: MonthData[] = [];
    const current = new Date(new Date(startDate).getFullYear(), new Date(startDate).getMonth(), 1);
    const end = new Date(new Date(endDate).getFullYear(), new Date(endDate).getMonth() + 1, 0);

    while (current <= end) {
      const monthData: MonthData = {
        month: current.getMonth(),
        year: current.getFullYear(),
        days: [],
      };

      // Get the first day of the month
      const firstDay = new Date(current.getFullYear(), current.getMonth(), 1);
      const lastDay = new Date(current.getFullYear(), current.getMonth() + 1, 0);

      // Get the first date to display (might be from previous month)
      const firstDisplayDate = new Date(firstDay);
      firstDisplayDate.setDate(firstDisplayDate.getDate() - firstDay.getDay());

      // Generate all days to display
      const days: DayData[] = [];
      const displayDate = new Date(firstDisplayDate);

      while (displayDate <= lastDay || displayDate.getDay() !== 0) {
        const dateString = displayDate.toISOString().split('T')[0];
        const isCurrentMonth = displayDate.getMonth() === current.getMonth();
        const isWeekend = displayDate.getDay() === 0 || displayDate.getDay() === 6;
        const isInRange = displayDate >= new Date(startDate) && displayDate <= new Date(endDate);

        if (isInRange) {
          days.push({
            date: new Date(displayDate),
            day: displayDate.getDate(),
            isCurrentMonth,
            isWeekend,
            dateString,
          });
        }

        displayDate.setDate(displayDate.getDate() + 1);
      }

      monthData.days = days;
      months.push(monthData);

      current.setMonth(current.getMonth() + 1);
    }
    console.log(months)
    return months;
  }, [startDate, endDate, gridType]);

  const handleDateClick = (dayData: DayData) => {
    if (disabledDates.has(dayData.dateString)) return;
    if (onDateSelect) {
      const isSelected = selectedDates.has(dayData.dateString);
      onDateSelect(dayData.date, !isSelected);
    }
  };

  const handlePrevMonth = () => {
    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1));
  };

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="w-full bg-background p-6 rounded-lg border border-border">
      <div className="space-y-6">
          {dateRangeData.map((monthData) => (
                <TooltipProvider>
                  <div key={`${monthData.year}-${monthData.month}`} className="space-y-4">
                    {/* Month Header */}
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-foreground">
                        {monthNames[monthData.month]} {monthData.year}
                      </h3>
                    </div>

                    {/* Day Names Header */}
                    <div className="grid grid-cols-7 gap-2">
                      {dayNames.map((day) => (
                        <div
                          key={day}
                          className="aspect-square flex items-center justify-center text-xs font-semibold text-muted-foreground bg-muted rounded"
                        >
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-2">
                      {monthData.days.map((dayData) => {
                        const isActiveDates = activeDates.indexOf(dayData.dateString) !== -1;
                        // const isDisabled = disabledDates.has(dayData.dateString);
                        const isOutOfMonth = !dayData.isCurrentMonth;

                        let cellClasses =
                          'aspect-square rounded-md flex items-center justify-center text-sm font-medium cursor-pointer transition-all ';

                        if (isOutOfMonth) {
                          cellClasses += 'text-muted-foreground bg-muted/30 cursor-default';
                        } else if (isActiveDates) {
                          cellClasses +=
                            'text-muted-foreground bg-chart-2';
                        } else if (true) {
                          cellClasses +=
                            'bg-destructive text-primary-foreground hover:bg-primary/90 shadow-md';
                        } else if (dayData.isWeekend) {
                          cellClasses +=
                            'bg-secondary/30 text-foreground hover:bg-secondary/50 border border-secondary';
                        } else {
                          cellClasses +=
                            'bg-accent/40 text-foreground hover:bg-accent/60 border border-accent';
                        }

                        return (
                          <Tooltip>
                          <TooltipTrigger asChild>
                          <button
                            key={dayData.dateString}
                            onClick={() => !isOutOfMonth && !false && handleDateClick(dayData)}
                            disabled={isOutOfMonth || false}
                            className={cellClasses}
                            title={`${dayData.date.toLocaleDateString()}`}
                          >
                            {new Date(dayData.dateString).getDate()}
                          </button>
                          </TooltipTrigger>
                          <TooltipContent side="left">
                            {
                              taskGridData[dayData.dateString] && Object.entries(taskGridData[dayData.dateString]).map((e:any,i:any)=>{
                                return (
                                  <p key={i} className="text-sm">{e} &nbsp;</p>
                                )
                              })
                            }
                            {
                              !taskGridData[dayData.dateString] && <p>Not Submitted</p>
                            }
                          </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </div>

                    {/* Divider */}
                    {monthData !== dateRangeData[dateRangeData.length - 1] && (
                      <div className="border-t border-border mt-6" />
                    )}
                  </div>
                </TooltipProvider>
              ))}
      </div>

      {/* Legend */}
      <div className="mt-8 pt-6 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary" />
            <span className="text-muted-foreground">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-secondary/30 border border-secondary" />
            <span className="text-muted-foreground">Weekend</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-accent/40 border border-accent" />
            <span className="text-muted-foreground">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-muted line-through" />
            <span className="text-muted-foreground">Disabled</span>
          </div>
        </div>
      </div>
    </div>
  );
}
