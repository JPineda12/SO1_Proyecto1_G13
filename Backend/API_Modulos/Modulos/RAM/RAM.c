#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/proc_fs.h>
#include <asm/uaccess.h>
#include <linux/seq_file.h>
#include <linux/hugetlb.h>

MODULE_LICENSE("GPL");
MODULE_DESCRIPTION("Modulo de RAM SOPES 1");
MODULE_AUTHOR("Grupo 13");

struct sysinfo info;

static int escribir_archivo(struct seq_file *archivo, void*v){
    long total;
    long libre;
    long consumida;
    long compartida;
    long buffer;
    long swap;
    si_meminfo(&info);
    total=info.totalram*info.mem_unit;
    libre=info.freeram*info.mem_unit;
    compartida=info.sharedram*info.mem_unit;
    buffer=info.bufferram*info.mem_unit;
    swap=info.freeswap*info.mem_unit;
    consumida=total-libre-compartida-buffer;
    
        
    seq_printf(archivo,"{\n\t\"Total\":%ld,\n",total);
    seq_printf(archivo,"\t\"Consumida\":%ld,\n",consumida); 
    seq_printf(archivo,"\t\"Libre\":%8ld,\n",libre);
    seq_printf(archivo,"\t\"Porcentaje\":%8ld\n}\n",((consumida*100)/total));

    
    return 0;
}

static int al_abrir(struct inode *inode,struct file *file){
    return single_open(file,escribir_archivo,NULL);
}

static struct proc_ops operaciones={
    .proc_open=al_abrir,
    .proc_read=seq_read
};

static int _insert(void)
{
    proc_create("ram_grupo13",0,NULL,&operaciones);
    printk(KERN_INFO "Modulo RAM del grupo 13 cargado\n");
    
    return 0;
} 

static void _remove(void)
{
    remove_proc_entry("ram_grupo13",NULL);
    printk(KERN_INFO "Modulo RAM del grupo 13 desmontado\n");
}

module_init(_insert);
module_exit(_remove);