

export const UserProjectsData = (items) => {
    let hoursActive = 0;
    let hoursRetired = 0;
    items.map(item => {
        if (!item.userProjects.isRetired) {
            hoursActive += item.userProjects.hours;
        } else if (item.userProjects.isRetired && !item.userProjects.isRemove) {
            hoursRetired += item.userProjects.hours;
        }
    })
    const activeQuantity = items.projects.filter((item) => !(item.userProjects.isRemove || item.userProjects.isRetired)).length
    const totalQuantity = items.projects.filter((item) => !(item.userProjects.isRemove)).length
    return {hoursActive,hoursRetired,activeQuantity,totalQuantity}
}