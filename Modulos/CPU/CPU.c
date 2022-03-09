#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/proc_fs.h>
#include <asm/uaccess.h>
#include <linux/seq_file.h>
#include <linux/hugetlb.h>
#include <linux/sched.h>
#include <linux/mm.h>

MODULE_LICENSE("GPL");
MODULE_DESCRIPTION("Modulo lista de procesos - Sistemas Operativos 1");
MODULE_AUTHOR("Grupo 13");

struct task_struct *task_list;
static int escribir_archivo(struct seq_file *archivo, void *v)
{
    bool first = true;
    seq_printf(archivo, "{\n\t\"Process_List\": [\n");
    for_each_process(task_list)
    {
        if(!first){
           seq_printf(archivo, ",\n");            
        }
        seq_printf(archivo, "\t\t{\n\t\t\"Name\": \"%s\",\n", task_list->comm);
        seq_printf(archivo, "\t\t\"PID\": %d,\n", task_list->pid);
        seq_printf(archivo, "\t\t\"State\": %ld,\n", task_list->state);
        seq_printf(archivo, "\t\t\"Parent_PID\": %d\n", task_list->parent->pid);
        seq_printf(archivo, "\t\t}");
        if(first){
            first = false;
        }
    }
    seq_printf(archivo, "\n\t]\n}\n");
    return 0;
}

static int al_abrir(struct inode *inode, struct file *file)
{
    return single_open(file, escribir_archivo, NULL);
}

static struct proc_ops operaciones = {
    .proc_open = al_abrir,
    .proc_read = seq_read};

static int _insert(void)
{
    proc_create("cpu_grupo13", 0, NULL, &operaciones);
    printk(KERN_INFO "Modulo lista de procesos del Grupo 13 cargado\n");

    return 0;
}

static void _remove(void)
{
    remove_proc_entry("cpu_grupo13", NULL);
    printk(KERN_INFO "Modulo lista de procesos del Grupo 13 desmontado\n");
}

module_init(_insert);
module_exit(_remove);