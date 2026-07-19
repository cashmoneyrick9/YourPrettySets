import { Link } from "react-router-dom";
import type { HelpQuickTask } from "@/data/helpContent";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type HelpTaskListProps = {
  tasks: readonly HelpQuickTask[];
};

export function HelpTaskList({ tasks }: HelpTaskListProps) {
  return (
    <Accordion className="help-task-list" collapsible defaultValue={tasks[0]?.id} type="single">
      {tasks.map((task, index) => (
        <AccordionItem className="help-task" key={task.id} value={task.id}>
          <AccordionTrigger className="help-task__trigger [&>svg]:hidden">
            <span aria-hidden="true" className="help-task__number">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="help-task__label">
              <strong>{task.title}</strong>
              <small>{task.summary}</small>
            </span>
            <span aria-hidden="true" className="help-task__icon" />
          </AccordionTrigger>
          <AccordionContent className="help-task__content">
            <p>{task.answer}</p>
            {task.steps ? (
              <ol>
                {task.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            ) : null}
            <Link to={task.action.href}>
              {task.action.label} <span aria-hidden="true">→</span>
            </Link>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
