#include <stdio.h>
#include <unistd.h>

int value = 0;

int main()

{

    pid_t   pid; int i;

 

    pid = fork();

    for(i=0;i<3;i++){

        if(pid == 0) {

           value = value + 1 ; 

           pid = fork();

        }

    }

    printf("value=%d\n", value); 

    return 0;

}